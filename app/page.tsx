import Sidebar from '../app/components/Sidebar';
import GroupTable from '../app/components/GroupTable';
import SidePanel from '../app/components/SidePanel';

const Home = () => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col h-full">
      <GroupTable />
    </div>
  </div>
);

export default Home;
