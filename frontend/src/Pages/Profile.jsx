import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { getProfile } from '../api/user';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import XPBar from '../Components/XPBar';
import Button from '../Components/Button';

const Profile = () => {
  const { username, xp, level, logout } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setProfile(response.profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextLevelXP = (level + 1) * 100;

  if (loading) {
    return (
      <ScreenContainer>
        <div className="animate-pulse text-muted-gray">Loading...</div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="pb-20 animate-fade-in">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-3xl font-heading font-bold mb-4">Profile</h1>
      </div>

      <GlassPanel className="mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-heading font-semibold mb-2">{username}</h2>
          <p className="text-muted-gray text-sm">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'recently'}</p>
        </div>
        <XPBar currentXP={xp} nextLevelXP={nextLevelXP} level={level} />
      </GlassPanel>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <GlassPanel className="text-center">
          <div className="text-2xl font-mono font-bold text-gold mb-1">
            {profile?.total_challenges || 0}
          </div>
          <div className="text-xs text-muted-gray">Total Challenges</div>
        </GlassPanel>
        <GlassPanel className="text-center">
          <div className="text-2xl font-mono font-bold text-gold mb-1">
            {profile?.completed_challenges || 0}
          </div>
          <div className="text-xs text-muted-gray">Completed</div>
        </GlassPanel>
        <GlassPanel className="text-center">
          <div className="text-2xl font-mono font-bold text-gold mb-1">
            {profile?.total_badges || 0}
          </div>
          <div className="text-xs text-muted-gray">Badges</div>
        </GlassPanel>
      </div>

      <GlassPanel>
        <h3 className="font-heading font-semibold mb-4">Account</h3>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full"
        >
          Logout
        </Button>
      </GlassPanel>
    </ScreenContainer>
  );
};

export default Profile;

