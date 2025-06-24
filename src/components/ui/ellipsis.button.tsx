import { Button, type ButtonProps } from "./button";
import { ellipsis } from "../../lib/utils/ellipsis";

type EllipsisButtonProps = ButtonProps & {
    label: string;
}

export function EllipsisButton({ label, className = "bg-blue-500 text-white hover:bg-blue-600", ...props }: EllipsisButtonProps) {
    return <Button className={className} {...props}>{ellipsis(label, 6)}</Button>;
}