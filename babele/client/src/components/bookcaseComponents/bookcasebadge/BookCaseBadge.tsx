import React from 'react';
import { ThemeComponentFactory } from '../../../context/theme';

export default function BookCaseBadge({ number }: { number: number }) {
  const Badge = ThemeComponentFactory('bookcaseComponents/bookcasebadge/BookCaseBadge');
  if (!number) {
    return null;
  }

  return <Badge>{number}</Badge>;
}
