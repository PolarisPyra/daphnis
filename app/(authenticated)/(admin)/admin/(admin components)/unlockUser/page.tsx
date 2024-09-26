import { getLockedUsers } from "./action";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const UnlockUserPage = async () => {
  const songs = (await getLockedUsers()) || [];

  return <DataTable columns={columns} data={songs} />;
};
export default UnlockUserPage;
