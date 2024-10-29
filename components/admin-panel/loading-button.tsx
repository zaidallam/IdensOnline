import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    iconMode?: boolean;
    className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading,
    onClick,
    children,
    iconMode = false,
    className,
    ...props
}) => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className={className + (iconMode ? "px-2" : "")}
            disabled={pending || isLoading}
            {...props}
        >
            {(pending || isLoading) && (
                <Loader2
                    className={
                        "animate-spin" +
                        (!iconMode ? "mr-2 h-4 w-4 animate-spin" : "")
                    }
                />
            )}
            {((pending || isLoading) && iconMode) || children}
        </Button>
    );
};

export default LoadingButton;
