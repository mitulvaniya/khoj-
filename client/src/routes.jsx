import React, { lazy, Suspense, useContext } from 'react';
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Spinner from './pages/Spinner';
import { GlobalContext } from './Context/GlobalContext';
import { getauth } from './utils/auth';
import Layout from './Layout';

const routes = [
  {
    path: '/',
    exact: true,
    Component: lazy(() => import('./pages/Home')),
  },
  {
    path: 'allCategories',
    exact: true,
    Component: lazy(() => import('./pages/AllCategory')),
  },
  {
    path: 'addCategory',
    exact: true,
    Component: lazy(() => import('./pages/AddCategory')),
  },
  {
    path: 'allServices',
    exact: true,
    Component: lazy(() => import('./pages/AllService')),
  },
  {
    path: 'addService',
    exact: true,
    Component: lazy(() => import('./pages/AddService')),
  },
  {
    path: 'allServices/:serviceId',
    exact: true,
    Component: lazy(() => import('./pages/ServiceDetail')),
  },
  {
    path: 'charts/services',
    exact: true,
    Component: lazy(() => import('./pages/ServiceChart')),
  },
  {
    path: 'charts/categories',
    exact: true,
    Component: lazy(() => import('./pages/CategoryChart')),
  },
  {
    path: 'myBookings',
    exact: true,
    Component: lazy(() => import('./pages/MyBookings')),
  },
  {
    path: 'profile',
    exact: true,
    Component: lazy(() => import('./pages/Profile')),
  },
  {
    path: 'setting',
    exact: true,
    Component: lazy(() => import('./pages/Setting')),
  },
  {
    path: 'admin',
    exact: true,
    Component: lazy(() => import('./pages/AdminDashboard')),
  },
];

/* ─── Role Separation ─── */
const adminPaths = ['admin', 'addCategory', 'charts/categories'];
const merchantPaths = ['addService', 'charts/services'];
const userProtectedPaths = ['myBookings', 'profile', 'setting'];
const allProtectedPaths = [...adminPaths, ...merchantPaths, ...userProtectedPaths];

const AdminRoute = ({ isLoggedIn, isAdmin }) => {
  if (!isLoggedIn) return <Navigate to='/login' />;
  if (!isAdmin) return <Navigate to='/khoj-services/allCategories?category=all&state=all&city=&name=' />;
  return <Outlet />;
};

const MerchantRoute = ({ isLoggedIn, isMerchant, isAdmin }) => {
  if (!isLoggedIn) return <Navigate to='/login' />;
  if (!isMerchant && !isAdmin) return <Navigate to='/khoj-services/allCategories?category=all&state=all&city=&name=' />;
  return <Outlet />;
};

const UserRoute = ({ isLoggedIn }) => {
  if (!isLoggedIn) return <Navigate to='/login' />;
  return <Outlet />;
};

const PublicRoutes = () => {
  const { data } = useContext(GlobalContext);

  const auth = getauth();
  const isLoggedIn = data.isLoggedIn || !!auth;
  const user = data.user || {};
  const userEmail = (user.email || localStorage.getItem('user_email') || '').toLowerCase();
  const isAdmin = userEmail === 'admin@gmail.com';
  const isMerchant = !!(user.isMerchant || data.isMerchant || localStorage.getItem('user_is_merchant') === 'true');

  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* ─── PUBLIC: Landing page at root ─── */}
          <Route
            path='/'
            element={
              <Layout>
                {React.createElement(lazy(() => import('./pages/Home')))}
              </Layout>
            }
          />

          {/* ─── AUTH pages ─── */}
          <Route
            path='/login'
            Component={lazy(() => import('./pages/Login'))}
          />
          <Route
            path='/registration'
            Component={lazy(() => import('./pages/Registration'))}
          />
          <Route
            path='/verifyOtp'
            Component={lazy(() => import('./pages/VerifyOtp'))}
          />
          <Route
            path='/changePassword/:email'
            Component={lazy(() => import('./pages/ChangePassword'))}
          />
          <Route
            path='/forgot-password'
            Component={lazy(() => import('./pages/ForgotPassword'))}
          />

          {/* ─── PUBLIC service browsing routes (no login needed) ─── */}
          {routes
            .filter(r => !allProtectedPaths.includes(r.path))
            .map(({ path, Component, exact }) => (
              <Route
                path={`khoj-services/${path}`}
                key={path}
                exact={exact}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            ))}

          {/* ─── ADMIN ONLY routes (admin@gmail.com) ─── */}
          <Route element={<AdminRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} />}>
            {routes
              .filter(r => adminPaths.includes(r.path))
              .map(({ path, Component, exact }) => (
                <Route
                  path={`khoj-services/${path}`}
                  key={path}
                  exact={exact}
                  element={
                    <Layout>
                      <Component />
                    </Layout>
                  }
                />
              ))}
          </Route>

          {/* ─── MERCHANT & ADMIN routes (addService, service metrics) ─── */}
          <Route element={<MerchantRoute isLoggedIn={isLoggedIn} isMerchant={isMerchant} isAdmin={isAdmin} />}>
            {routes
              .filter(r => merchantPaths.includes(r.path))
              .map(({ path, Component, exact }) => (
                <Route
                  path={`khoj-services/${path}`}
                  key={path}
                  exact={exact}
                  element={
                    <Layout>
                      <Component />
                    </Layout>
                  }
                />
              ))}
          </Route>

          {/* ─── LOGGED-IN USER routes (bookings, profile, setting) ─── */}
          <Route element={<UserRoute isLoggedIn={isLoggedIn} />}>
            {routes
              .filter(r => userProtectedPaths.includes(r.path))
              .map(({ path, Component, exact }) => (
                <Route
                  path={`khoj-services/${path}`}
                  key={path}
                  exact={exact}
                  element={
                    <Layout>
                      <Component />
                    </Layout>
                  }
                />
              ))}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default PublicRoutes;
