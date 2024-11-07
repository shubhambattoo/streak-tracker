import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Flame, CheckCircle, RotateCcw } from 'lucide-react';

function StreakTracker() {
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<Date | null>(null);
  const [completedDates, setCompletedDates] = useState<Date[]>([]);

  useEffect(() => {
    const storedStreak = localStorage.getItem('streak');
    const storedLastCompletedDate = localStorage.getItem('lastCompletedDate');
    const storedCompletedDates = localStorage.getItem('completedDates');

    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }
    if (storedLastCompletedDate) {
      setLastCompletedDate(new Date(storedLastCompletedDate));
    }
    if (storedCompletedDates) {
      const parsedDates = JSON.parse(storedCompletedDates);
      if (parsedDates.length) {
        setCompletedDates(
          JSON.parse(storedCompletedDates).map((date: string) => new Date(date))
        );
      }
    }
  }, []);

  useEffect(() => {
    if (streak) {
      localStorage.setItem('streak', streak.toString());
    }
    if (lastCompletedDate) {
      localStorage.setItem(
        'lastCompletedDate',
        lastCompletedDate.toISOString()
      );
    }
    if (completedDates) {
      localStorage.setItem(
        'completedDates',
        JSON.stringify(completedDates.map((date) => date.toISOString()))
      );
    }
  }, [streak, lastCompletedDate, completedDates]);

  const markComplete = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!lastCompletedDate || lastCompletedDate < today) {
      setStreak((prev) => prev + 1);
      setLastCompletedDate(today);
      setCompletedDates((prev) => [...prev, today]);
    }
  };

  const resetStreak = () => {
    localStorage.clear();
    setStreak(0);
    setCompletedDates([]);
    setLastCompletedDate(null);
  };

  return (
    <div className="min-h-dvh w-dvw mx-auto bg-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-4 flex items-center">
          {' '}
          <img width={50} src="/logo.png" alt="streak master logo" /> Streak
          Master
        </h1>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Current Streak{' '}
              <Button onClick={resetStreak} variant={'secondary'} title='reset streak'>
                <RotateCcw />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center ml-[-12px]">
              <Flame className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-4xl font-bold">{streak}</span>
            </div>
            <Button
              className="w-full mt-4"
              onClick={markComplete}
              disabled={
                lastCompletedDate?.toDateString() === new Date().toDateString()
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Mark Today Complete
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Streak Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={completedDates}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default StreakTracker;
