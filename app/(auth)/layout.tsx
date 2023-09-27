import { ReactNode } from "react";

type LayoutAuthType = {
  children: ReactNode
}

const LayoutAuth = ({ children }: LayoutAuthType) => {
  return (
    <div className="flex justify-center items-center h-full">
      {children}
    </div>
  );
}

export default LayoutAuth;