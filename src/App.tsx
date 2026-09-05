import React from 'react';
import { AppProvider, useApp } from './store';
import { Toast } from './components/primitives';
import { AuthScreen } from './pages/AuthScreen';
import { FeedView } from './pages/FeedView';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPanel } from './pages/AdminPanel';
import { GroupHubPage } from './pages/GroupHubPage';
import { MessagesView } from './pages/MessagesView';
import { AlertsView } from './pages/AlertsView';
import { EventsView } from './pages/EventsView';
import { StudyView } from './pages/StudyView';
import { ExploreView } from './pages/ExploreView';
import { HashtagPage } from './pages/HashtagPage';

function Router() {
  const { currentUser, view } = useApp();

  if (!currentUser) {
    return <AuthScreen />;
  }

  switch (view) {
    case 'feed':
      return <FeedView />;
    case 'profile':
      return <ProfilePage />;
    case 'settings':
      return <SettingsPage />;
    case 'admin':
      return <AdminPanel />;
    case 'groups':
      return <GroupHubPage />;
    case 'messages':
      return <MessagesView />;
    case 'alerts':
      return <AlertsView />;
    case 'events':
      return <EventsView />;
    case 'study':
      return <StudyView />;
    case 'explore':
      return <ExploreView />;
    case 'hashtag':
      return <HashtagPage />;
    default:
      return <FeedView />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
      <Toast />
    </AppProvider>
  );
}
