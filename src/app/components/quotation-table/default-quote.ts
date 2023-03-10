import { Quote } from 'src/app/app-interfaces';

export const defaultQuote = (id: string): Quote => {
  return {
    id: id,
    items: [
      {
        id: '1',
        type: 'root',
        description: 'Root',
        quantity: null,
        unit: null,
        unitPrice: null,
        totalPrice: null,
        childrenIds: ['2'],
        parentId: null,
      },
      {
        id: '2',
        type: 'mainGroup',
        description: 'Description par défaut -- Groupe de chiffrage',
        quantity: null,
        unit: null,
        unitPrice: null,
        totalPrice: null,
        childrenIds: ['3'],
        parentId: '1',
      },
      {
        id: '3',
        type: 'subGroup',
        description: 'Description par défaut -- Sous-groupe de chiffrage',
        quantity: null,
        unit: null,
        unitPrice: null,
        totalPrice: null,
        childrenIds: ['4'],
        parentId: '2',
      },
      {
        id: '4',
        type: 'quotationLine',
        description: 'Description par défaut -- Ligne de chiffrage',
        quantity: null,
        unit: null,
        unitPrice: null,
        totalPrice: null,
        childrenIds: [],
        parentId: '3',
      },
    ],
  };
};
