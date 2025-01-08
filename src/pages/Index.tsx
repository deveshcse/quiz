import { useState } from 'react';
import { useGetSubjectsQuery, useGetTopicsQuery, useGetQuestionsQuery } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"
import QuizInterface from '@/components/QuizInterface';

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [yearRange, setYearRange] = useState([1990, 2023]);
  const [quizStarted, setQuizStarted] = useState(false);

  const { data: subjects} = useGetSubjectsQuery();
  const { data: topics } = useGetTopicsQuery(Number(selectedSubject), {
    skip: !selectedSubject,
  });
  const { data: questions } = useGetQuestionsQuery();
  const { toast } = useToast();

  const filteredQuestions = questions?.filter(
    (q) => 
      q.subject_id === Number(selectedSubject) &&
      q.topic_id === Number(selectedTopic) &&
      q.year >= yearRange[0] &&
      q.year <= yearRange[1]
  );

  const handleStartQuiz = () => {
    if (!selectedSubject || !selectedTopic) {
      toast({
        title: "Selection Required",
        description: "Please select both subject and topic before starting the quiz.",
        variant: "destructive",
      });
      return;
    }
    if (!filteredQuestions?.length) {
      toast({
        title: "No Questions Available",
        description: "No questions found for the selected criteria.",
        variant: "destructive",
      });
      return;
    }
    setQuizStarted(true);
  };

  if (quizStarted && filteredQuestions) {
    return <QuizInterface questions={filteredQuestions} onExit={() => setQuizStarted(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              UPSC Previous Questions Practice
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Select your preferences to start practicing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <Select
                  value={selectedTopic}
                  onValueChange={setSelectedTopic}
                  disabled={!selectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics?.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id.toString()}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Year Range: {yearRange[0]} - {yearRange[1]}
                </label>
                <Slider
                  defaultValue={yearRange}
                  max={2023}
                  min={1990}
                  step={1}
                  onValueChange={setYearRange}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleStartQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Start Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;