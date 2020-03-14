import React from "react";

interface SettingProps {
  name: string;
  children: any;
}

function Setting({ name, children }: SettingProps) {
  return (
    <div className="setting">
      <p className="name">{name}</p>
      {children}
    </div>
  );
}

export default Setting;
