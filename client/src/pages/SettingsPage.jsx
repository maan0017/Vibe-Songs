export const SettingsPage = ({ setNavbarVisiblity }) => {
  setNavbarVisiblity(false);
  return (
    <div className="flex">
      <div className="w-72 h-[94vh] bg-slate-800 text-white text-3xl text-center ">
        Menu
      </div>
      <div className=" w-full bg-white">Options</div>
    </div>
  );
};

export default SettingsPage;
