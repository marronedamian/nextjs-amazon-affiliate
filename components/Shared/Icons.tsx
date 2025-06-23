import React, { SVGProps, ComponentType } from "react";
import { FaChevronDown as RawChevronDown } from "react-icons/fa";

const ChevronDownIcon = RawChevronDown as unknown as ComponentType<SVGProps<SVGSVGElement>>;

export function FaChevronDown(props: SVGProps<SVGSVGElement>) {
    return <ChevronDownIcon {...props} />;
}
