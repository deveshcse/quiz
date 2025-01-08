import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import QuizNavigation from './quiz/QuizNavigation';
import QuizResults from './quiz/QuizResults';
import { UserAnswer } from './quiz/types';
import { useToast } from '@/hooks/use-toast';

interface QuizInterfaceProps {
  questions: Question[];
  onExit: () => void;
}

const QuizInterface = ({ questions, onExit }: QuizInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizCompleted]);

  const handleAnswerSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!showExplanation) {
      const isCorrect = selectedAnswer === currentQuestion.correct_option;
      if (isCorrect) {
        setScore(score + 1);
        toast({
          title: "Correct!",
          description: "Well done! Let's look at the explanation.",
          variant: "default",
        });
      } else {
        toast({
          title: "Incorrect",
          description: "Let's learn from the explanation.",
          variant: "destructive",
        });
      }

      setUserAnswers([
        ...userAnswers,
        {
          questionId: currentQuestion.id,
          selectedOption: selectedAnswer,
          isCorrect,
          timeSpent: 120 - timeLeft,
        },
      ]);

      setShowExplanation(true);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setTimeLeft(120);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setTimeLeft(120);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = userAnswers.find(
        (answer) => answer.questionId === questions[currentQuestionIndex - 1].id
      );
      setSelectedAnswer(prevAnswer?.selectedOption || '');
      setShowExplanation(true);
      setTimeLeft(120);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizCompleted) {
    return (
      <QuizResults
        questions={questions}
        userAnswers={userAnswers}
        score={score}
        startTime={startTime}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1}/{questions.length}
              </div>
              <div className="text-sm font-medium text-amber-600">
                Time Left: {formatTime(timeLeft)}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
            <CardTitle className="text-xl font-semibold mt-4">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['A', 'B', 'C', 'D'].map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full justify-start text-left p-4 h-auto ${
                  selectedAnswer === option
                    ? 'bg-blue-100 border-blue-500'
                    : showExplanation && option === currentQuestion.correct_option
                    ? 'bg-green-100 border-green-500'
                    : ''
                }`}
                variant="outline"
              >
                {option}. {currentQuestion[`option_${option.toLowerCase()}` as keyof Question]}
              </Button>
            ))}

            {showExplanation && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
                <p className="text-gray-700">{currentQuestion.explanation_text}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <QuizNavigation
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              showExplanation={showExplanation}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default QuizInterface;