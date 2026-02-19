import { Helmet } from 'react-helmet-async';

import { DashboardOverviewView } from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

export default function DashboardOverviewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard : Administrator Overview</title>
      </Helmet>

      <DashboardOverviewView />
    </>
  );
}
