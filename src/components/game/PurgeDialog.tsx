"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, DollarSign, Wallet } from "lucide-react";

interface PurgeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedType: "button" | "chart") => void;
}

export function PurgeDialog({ isOpen, onClose, onConfirm }: PurgeDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-red-500/50 text-slate-100 sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                        <AlertTriangle className="h-6 w-6" />
                        <DialogTitle className="text-xl font-bold tracking-widest uppercase">
                            System Purge Initiated
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400">
                        Identify the source of the anomaly to execute a targeted purge.
                        <br />
                        <span className="text-red-400 font-bold text-xs mt-1 block">
                            WARNING: WRONG SELECTION WILL FAIL THE PURGE.
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-3 py-4">
                    <Button
                        variant="outline"
                        className="flex items-center justify-start gap-3 h-14 border-slate-700 hover:bg-slate-800 hover:text-yellow-400 group relative overflow-hidden"
                        onClick={() => onConfirm("button")}
                    >
                        <div className="bg-yellow-500/10 p-2 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                            <DollarSign className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-bold">Button Malfunction</span>
                            <span className="text-xs text-slate-500">
                                Any visual or functional error on Buy/Sell buttons
                            </span>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="flex items-center justify-start gap-3 h-14 border-slate-700 hover:bg-slate-800 hover:text-blue-400 group relative overflow-hidden"
                        onClick={() => onConfirm("chart")}
                    >
                        <div className="bg-blue-500/10 p-2 rounded-full group-hover:bg-blue-500/20 transition-colors">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-bold">Chart / Data Anomaly</span>
                            <span className="text-xs text-slate-500">
                                Distorted graph, missing axes, or WRONG CURRENCY
                            </span>
                        </div>
                    </Button>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-300"
                        onClick={onClose}
                    >
                        Cancel Purge
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
