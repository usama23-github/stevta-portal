type ProfileItemProps = {
  label: string;
  value: string;
};

const ProfileItem = ({
  label,
  value,
}: ProfileItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 transition hover:border-[#bfdbfe] hover:bg-[#eff6ff]">
      <span className="text-sm font-medium text-[#64748b]">
        {label}
      </span>

      <span className="text-right font-semibold text-[#0f172a]">
        {value}
      </span>
    </div>
  );
};

export default ProfileItem;