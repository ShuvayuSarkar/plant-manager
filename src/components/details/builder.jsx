import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Save, Edit } from "lucide-react";
import geminiIcon from "@/icons/google-gemini-icon.svg";
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { createStrategy, getUserStrategies, updateStrategy, deleteStrategy, createEmotion, getUserEmotions, updateEmotion, deleteEmotion } from '@/lib/firebase/database/index';
import { toast } from "sonner";
import { trackEvent } from '@/lib/mixpanelClient';

export default function Builder() {
  // State management
  const [strategies, setStrategies] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // Emotion state management
  const [emotions, setEmotions] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isCreatingNewEmotion, setIsCreatingNewEmotion] = useState(false);

  // Form state
  const [strategyName, setStrategyName] = useState('');
  const [entryRules, setEntryRules] = useState(['']);
  const [exitRules, setExitRules] = useState(['']);
  const [entryNotes, setEntryNotes] = useState('');
  const [exitNotes, setExitNotes] = useState('');

  // Emotion form state (simplified)
  const [emotionName, setEmotionName] = useState('');

  const strategyNameRef = useRef();

  // Load strategies and emotions on component mount
  useEffect(() => {
    loadStrategies();
    loadEmotions();
  }, []);

  // Debug: Log when strategies change
  useEffect(() => {
    console.log('🔄 Strategies state updated:', strategies.length, strategies);
  }, [strategies]);

  // Debug: Log when emotions change
  useEffect(() => {
    console.log('🔄 Emotions state updated:', emotions.length, emotions);
  }, [emotions]);

  const loadStrategies = async () => {
    console.log('🔄 Loading strategies...');
    try {
      setLoading(true);
      const response = await getUserStrategies();
      console.log('🔄 Got strategies response:', response);
      console.log('🔄 Response type:', typeof response);
      console.log('🔄 Response length:', response?.length);
      
      setStrategies(response || []);
      console.log('✅ Loaded strategies successfully:', response?.length || 0);
      console.log('✅ Strategies data:', response);
    } catch (error) {
      console.error('❌ Error loading strategies:', error);
      // Don't show error toast on initial load, just log it
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmotions = async () => {
    try {
      setLoading(true);
      const response = await getUserEmotions();
      setEmotions(response || []);
      console.log('✅ Loaded emotions successfully:', response?.length || 0);
      console.log('✅ Emotions data:', response);
    } catch (error) {
      console.error('Error loading emotions:', error);
      // Don't show error toast on initial load, just log it
      setEmotions([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStrategyName('');
    setEntryRules(['']);
    setExitRules(['']);
    setEntryNotes('');
    setExitNotes('');
    setCurrentStrategy(null);
    setIsCreatingNew(false);
  };

  const resetEmotionForm = () => {
    setEmotionName('');
    setCurrentEmotion(null);
    setIsCreatingNewEmotion(false);
  };

  const handleCreateNewStrategy = () => {
    resetForm();
    setIsCreatingNew(true);
  };

  const handleCreateNewEmotion = () => {
    resetEmotionForm();
    setIsCreatingNewEmotion(true);
  };

  const handleSelectStrategy = (strategy) => {
    setCurrentStrategy(strategy);
    setStrategyName(strategy.name || '');
    setEntryRules(strategy.entry || ['']);
    setExitRules(strategy.exit || ['']);
    setEntryNotes(strategy.additionalNotes?.entry || '');
    setExitNotes(strategy.additionalNotes?.exit || '');
    setIsCreatingNew(false);
  };

  const handleSelectEmotion = (emotion) => {
    setCurrentEmotion(emotion);
    setEmotionName(emotion.name || '');
    setIsCreatingNewEmotion(false);
  };

  const handleSaveStrategy = async () => {
    if (!strategyName.trim()) {
      toast.error('Please enter a strategy name');
      return;
    }

    console.log('📝 Saving strategy:', strategyName);
    console.log('📝 Current strategies before save:', strategies.length);

    const filteredEntryRules = entryRules.filter(rule => rule.trim() !== '');
    const filteredExitRules = exitRules.filter(rule => rule.trim() !== '');

    const strategyData = {
      name: strategyName,
      entry: filteredEntryRules,
      exit: filteredExitRules,
      additionalNotes: {
        entry: entryNotes,
        exit: exitNotes
      },
      trades: {} // Empty map for trades
    };

    console.log('📝 Strategy data:', strategyData);

    try {
      setLoading(true);
      if (currentStrategy) {
        // Update existing strategy
        console.log('📝 Updating existing strategy:', currentStrategy.id);
        await updateStrategy(currentStrategy.id, strategyData);
        toast.success('Strategy updated successfully');
      } else {
        // Create new strategy
        console.log('📝 Creating new strategy...');
        const result = await createStrategy(strategyData);
        console.log('📝 Strategy created successfully:', result);
        toast.success('Strategy created successfully');
      }

      console.log('📝 Reloading strategies...');
      await loadStrategies();
      console.log('📝 Strategies after reload:', strategies.length);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving strategy:', error);
      toast.error('Failed to save strategy: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStrategy = async (strategyId) => {
    if (!confirm('Are you sure you want to delete this strategy?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteStrategy(strategyId);
      toast.success('Strategy deleted successfully');
      await loadStrategies();

      if (currentStrategy?.id === strategyId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting strategy:', error);
      toast.error('Failed to delete strategy');
    } finally {
      setLoading(false);
    }
  };

  const addEntryRule = () => {
    setEntryRules([...entryRules, '']);
  };

  const updateEntryRule = (index, value) => {
    const newRules = [...entryRules];
    newRules[index] = value;
    setEntryRules(newRules);
  };

  const removeEntryRule = (index) => {
    if (entryRules.length > 1) {
      setEntryRules(entryRules.filter((_, i) => i !== index));
    }
  };

  const addExitRule = () => {
    setExitRules([...exitRules, '']);
  };

  const updateExitRule = (index, value) => {
    const newRules = [...exitRules];
    newRules[index] = value;
    setExitRules(newRules);
  };

  const removeExitRule = (index) => {
    if (exitRules.length > 1) {
      setExitRules(exitRules.filter((_, i) => i !== index));
    }
  };

  // Emotion handler functions
  const handleSaveEmotion = async () => {
    if (!emotionName.trim()) {
      toast.error('Please enter an emotion name');
      return;
    }

    const emotionData = {
      name: emotionName,
      description: "", // Default empty values since we removed the form
      triggers: [],
      strategies: [],
      additionalNotes: ""
    };

    try {
      setLoading(true);
      if (currentEmotion) {
        // Update existing emotion
        await updateEmotion(currentEmotion.id, emotionData);
        toast.success('Emotion updated successfully');
      } else {
        // Create new emotion
        await createEmotion(emotionData);
        toast.success('Emotion created successfully');
      }

      await loadEmotions();
      resetEmotionForm();
    } catch (error) {
      console.error('Error saving emotion:', error);
      toast.error('Failed to save emotion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmotion = async (emotionId) => {
    if (!confirm('Are you sure you want to delete this emotion?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteEmotion(emotionId);
      toast.success('Emotion deleted successfully');
      await loadEmotions();

      if (currentEmotion?.id === emotionId) {
        resetEmotionForm();
      }
    } catch (error) {
      console.error('Error deleting emotion:', error);
      toast.error('Failed to delete emotion');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmotionSuggestion = (emotionName) => {
    // Populate the input field and show the form
    setEmotionName(emotionName);
    setIsCreatingNewEmotion(true);
    setCurrentEmotion(null);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded flex flex-col h-[calc(100vh-6.3rem)]">
        <CardContent className="space-y-6 flex-1 overflow-y-auto custom-scroll">
          <CardHeader className="p-0 m-0">
            <CardTitle className="text-neutral-900 dark:text-neutral-100 font-bold">Strategy builder</CardTitle>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="italic">Why to use strategy builder ?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <ol type='1' className='list-decimal space-y-1.5 text-sm text-neutral-700 pl-4 '>
                  <li>Create the strategy with entry and exit rules. this will help you in understanding whether you followed the rules or not</li>
                  <li>Daily, after the trade, tick mark the boxes and check if you have followed rules or not </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Strategy Creation/Selection */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {/* Add Button with Dynamic Text */}
            <div className="flex items-center gap-2">
              <Button
                variant="icon"
                size="sm"
                onClick={handleCreateNewStrategy}
                disabled={loading}
              >
                <span className='rounded-full bg-green-500 p-0.5'>
                  <Plus className='w-2 h-2 text-white' />
                </span>
              </Button>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {strategies.length === 0 ? "Create a setup" : "My setups"}
              </span>
            </div>

            {/* Strategy Name Input (when creating new) */}
            {isCreatingNew && (
              <div className="flex gap-2 items-center">
                <Input
                  ref={strategyNameRef}
                  type="text"
                  placeholder="Strategy name"
                  className="w-32"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveStrategy();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveStrategy}
                  disabled={loading || !strategyName.trim()}
                >
                  <Save className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Existing Strategies - shown to the right of "My setups" text */}
            {strategies.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="flex items-center gap-1">
                    <Button
                      variant={currentStrategy?.id === strategy.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectStrategy(strategy)}
                      disabled={loading}
                      className="capitalize"
                    >
                      {strategy.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStrategy(strategy.id)}
                      disabled={loading}
                      className="p-1 h-6 w-6"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <div className="flex items-center gap-2">
              <div>
                <Image src={geminiIcon} alt="gemini" width={20} height={20} className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Suggestions</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStrategyName("3 candle setup")}
            >
              3 candle setup
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStrategyName("9, 20 ema strategy")}
            >
              9, 20 ema strategy
            </Button>
          </div>

          {/* Emotion Addition Section - Between Suggestions and Entry Rules */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {/* Add Emotion Button with Dynamic Text */}
            <div className="flex items-center gap-2">
              <Button
                variant="icon"
                size="sm"
                onClick={handleCreateNewEmotion}
                disabled={loading}
              >
                <span className='rounded-full bg-blue-500 p-0.5'>
                  <Plus className='w-2 h-2 text-white' />
                </span>
              </Button>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {emotions.length === 0 ? "Add emotions" : "My emotions"}
              </span>
            </div>

            {/* Emotion Name Input (when creating new) */}
            {isCreatingNewEmotion && (
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Emotion name"
                  className="w-32"
                  value={emotionName}
                  onChange={(e) => setEmotionName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEmotion();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveEmotion}
                  disabled={loading || !emotionName.trim()}
                >
                  <Save className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Existing Emotions - shown to the right of "My emotions" text */}
            {emotions.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {emotions.map((emotion) => (
                  <div key={emotion.id} className="flex items-center gap-1">
                    <Button
                      variant={currentEmotion?.id === emotion.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectEmotion(emotion)}
                      disabled={loading}
                      className="capitalize"
                    >
                      {emotion.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmotion(emotion.id)}
                      disabled={loading}
                      className="p-1 h-6 w-6"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emotion Suggestions */}
          <div className="flex gap-2 mt-2">
            <div className="flex items-center gap-2">
              <div>
                <Image src={geminiIcon} alt="gemini" width={20} height={20} className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Emotions</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddEmotionSuggestion("Fear")}
            >
              Fear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddEmotionSuggestion("Greed")}
            >
              Greed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddEmotionSuggestion("FOMO")}
            >
              FOMO
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddEmotionSuggestion("Confidence")}
            >
              Confidence
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddEmotionSuggestion("Excitement")}
            >
              Excitement
            </Button>
          </div>
        </CardHeader>

        {/* Entry Rules Section */}
        <div className='flex flex-col gap-2'>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Entry rules</h3>
          <div className="space-y-2">
            {entryRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox />
                <Input
                  placeholder="write your rules / entry criteria here"
                  value={rule}
                  onChange={(e) => updateEntryRule(index, e.target.value)}
                />
                {entryRules.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntryRule(index)}
                    className="p-1 h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addEntryRule}
            className="w-fit"
          >
            add rule
          </Button>
          <div className="flex flex-col gap-2">
            <Label className="text-neutral-600 dark:text-neutral-400 text-sm">Additional notes</Label>
            <Textarea
              rows={3}
              placeholder="Additional notes for entry strategy..."
              value={entryNotes}
              onChange={(e) => setEntryNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Exit Rules Section */}
        <div className='flex flex-col gap-2'>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Exit rules</h3>
          <div className="space-y-2">
            {exitRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox />
                <Input
                  placeholder="write your rules / exit criteria here"
                  value={rule}
                  onChange={(e) => updateExitRule(index, e.target.value)}
                />
                {exitRules.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExitRule(index)}
                    className="p-1 h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addExitRule}
            className="w-fit"
          >
            add rule
          </Button>
          <div className="flex flex-col gap-2">
            <Label className="text-neutral-600 dark:text-neutral-400 text-sm">Additional notes</Label>
            <Textarea
              rows={3}
              placeholder="Additional notes for exit strategy..."
              value={exitNotes}
              onChange={(e) => setExitNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Save Strategy Button */}
        {(isCreatingNew || currentStrategy) && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveStrategy}
              disabled={loading || !strategyName.trim()}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {currentStrategy ? 'Update Strategy' : 'Save Strategy'}
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}