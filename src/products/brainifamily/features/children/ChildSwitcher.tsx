import React from 'react';
import { useCurrentChild } from '@/products/brainifamily/hooks/useCurrentChild';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

/** Selector de hijo para la cabecera de las páginas de familias. Solo aparece si hay más de un hijo. */
const ChildSwitcher: React.FC = () => {
  const { child, children: childrenList, setCurrentChildId } = useCurrentChild();
  if (childrenList.length <= 1) return null;

  return (
    <Select value={child?.id ?? ''} onValueChange={setCurrentChildId}>
      <SelectTrigger
        aria-label="Elegir hijo o hija"
        className="w-full sm:w-auto min-w-[200px] bg-white border-0 text-ink font-medium shadow-sm"
      >
        <SelectValue placeholder="Elegir hijo o hija" />
      </SelectTrigger>
      <SelectContent>
        {childrenList.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.school_name ? `${c.nombre} (${c.school_name})` : c.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChildSwitcher;
