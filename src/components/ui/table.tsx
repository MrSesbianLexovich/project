import { EllipsisVertical } from "lucide-react";

interface TableProps {
  name: string;
}

export default function Table({ name}: TableProps) {
  
  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 border rounded-t-2xl">{name}</div>
      <div className="flex flex-col py-2 border-l border-r border-b rounded-b-2xl">
        {data.map((data.name) => (
          <div className="flex flex-row px-4 py-2 justify-between">
            {data.name}
            <button type="button">
              <EllipsisVertical />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
