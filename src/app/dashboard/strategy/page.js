'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Shield,
  Plus,
  Smile,
  Frown,
  Meh,
  Heart,
  Zap,
  Brain,
  Award,
  BookOpen
} from 'lucide-react';
import TradePanel from '@/components/details/tradePanel';
import FeelingsPanel from '@/components/details/feelingsPanel';

export default function TradingStrategyBuilder() {
  const [entryRules, setEntryRules] = useState(['']);
  const [exitRules, setExitRules] = useState(['']);
  const [journalEntry, setJournalEntry] = useState('');

 

  const updateEntryRule = (index, value) => {
    const newRules = [...entryRules];
    newRules[index] = value;
    setEntryRules(newRules);
  };






  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

      <TradePanel />

      

      <FeelingsPanel />

    </div>
  );
}