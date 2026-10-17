import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiCopy, FiUsers } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { membershipApi } from '../../services/growthApi';
import Button from '../../components/ui/Button';

const Referrals = () => {
  const queryClient = useQueryClient();
  const [applyCode, setApplyCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['referral-code'],
    queryFn: () => membershipApi.getMyReferralCode(),
    select: (res) => res.data.data,
  });

  const handleApplyCode = async (e) => {
    e.preventDefault();
    if (!applyCode.trim()) return;
    setIsApplying(true);
    try {
      await membershipApi.applyReferralCode(applyCode.trim().toUpperCase());
      toast.success('Referral code applied successfully!');
      setApplyCode('');
      queryClient.invalidateQueries({ queryKey: ['referral-code'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid referral code');
    } finally {
      setIsApplying(false);
    }
  };

  const referralLink = data?.referralCode ? `${window.location.origin}/signup?ref=${data.referralCode}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Refer a Friend</title></Helmet>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Refer a Friend</h1>
        <p className="mt-1 text-sm text-bamboo-500">
          Share your code — you both earn rewards when they place their first order!
        </p>

        <div className="card mt-6 p-6">
          {isLoading ? (
            <div className="h-12 animate-pulse rounded-xl bg-sand-200" />
          ) : (
            <>
              <p className="text-xs uppercase tracking-wide text-bamboo-400">Your Referral Code</p>
              <p className="mt-1 font-display text-2xl font-bold tracking-widest text-bamboo-700">{data?.referralCode}</p>

              <div className="mt-4 flex gap-2">
                <input readOnly value={referralLink} className="input-field !py-2.5 text-xs" />
                <button onClick={handleCopy} className="btn-secondary flex shrink-0 items-center gap-1.5 !px-4 !py-2.5 text-xs">
                  <FiCopy size={13} /> Copy
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Join Wa-Kriti using my referral link and get rewarded! ${referralLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-white"
                >
                  <FaWhatsapp size={16} />
                </a>
              </div>
            </>
          )}
        </div>

        {!data?.referredBy && (
          <div className="card mt-6 p-6">
            <p className="text-sm font-semibold text-bamboo-800">Have a referral code?</p>
            <form onSubmit={handleApplyCode} className="mt-2 flex gap-2">
              <input
                value={applyCode}
                onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                className="input-field !py-2.5 text-sm"
              />
              <Button type="submit" isLoading={isApplying} className="!px-4 !py-2.5 text-xs">Apply</Button>
            </form>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4">
          <StatCard label="Total Referred" value={data?.stats?.totalReferred ?? 0} />
          <StatCard label="Rewarded" value={data?.stats?.rewarded ?? 0} />
          <StatCard label="Pending" value={data?.stats?.pending ?? 0} />
        </div>

        <h2 className="mt-8 flex items-center gap-2 font-display text-lg font-semibold text-bamboo-800">
          <FiUsers size={18} /> Referral History
        </h2>
        {!data?.referrals?.length ? (
          <p className="mt-3 text-sm text-bamboo-400">No referrals yet. Share your link to get started!</p>
        ) : (
          <div className="mt-3 divide-y divide-sand-300 rounded-2xl bg-white shadow-soft">
            {data.referrals.map((r) => (
              <div key={r._id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-bamboo-700">{r.referredEmail || 'Pending signup'}</span>
                <span className="rounded-full bg-bamboo-100 px-2.5 py-1 text-xs font-semibold capitalize text-bamboo-700">
                  {r.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="card p-4 text-center">
    <p className="font-display text-xl font-bold text-bamboo-700">{value}</p>
    <p className="mt-1 text-xs text-bamboo-500">{label}</p>
  </div>
);

export default Referrals;
