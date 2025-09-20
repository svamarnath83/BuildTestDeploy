'use client';

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@commercialapp/ui";

interface AddEntityButtonProps<T> {
  onAdd: (data: T) => void;
  ModalComponent?: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    onSubmit: (data: T) => void;
    onCancel: () => void;    // added onCancel prop
  }>;
  onShowForm?: () => void;
}

export function AddEntityButton<T>({
  onAdd,
  ModalComponent,
  onShowForm,
}: AddEntityButtonProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleAddClick = () => {
    setEditId(null);
    if (onShowForm) {
      onShowForm();
    } else {
      setIsOpen(true);
    }
  };

  const handleSubmit = (data: T) => {
    onAdd(data);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        aria-label="Add"
        onClick={handleAddClick}
      >
        <Plus className="h-4 w-4" />
      </Button>

      {ModalComponent && !onShowForm && (
        <ModalComponent
          open={isOpen}
          onOpenChange={setIsOpen}
          id={editId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
