import React from 'react';
import AgentSidebar from './AgentSidebar';
import AgentAppBar from './AgentAppBar';

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex">
      <AgentSidebar />
      <div className="grow h-full flex flex-col bg-white px-4 md:px-8  space-y-4 md:space-y-6 overflow-auto pb-10">
        <AgentAppBar />
        {children}
      </div>
    </div>
  );
};

export default DashBoardLayout;
