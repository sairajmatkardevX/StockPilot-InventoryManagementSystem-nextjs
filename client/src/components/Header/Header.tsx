"use client";

import { Separator } from "@/components/ui/separator";
import { Package2 } from "lucide-react";

type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between py-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-sm">
          <Package2 className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
          {name}
        </h1>
      </div>
      <Separator className="mt-4" />
    </div>
  );
};

export default Header;
