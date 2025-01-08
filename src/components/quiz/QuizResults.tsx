import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/lib/api";
import { UserAnswer } from "./types";


interface QuizResultsProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  score: number;
  startTime: number;
  onExit: () => void;
}

const QuizResults = ({ questions, userAnswers, score, startTime, onExit }: QuizResultsProps) => {
  const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
  const accuracy = (score / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Quiz Results
            </CardTitle>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score}/{questions.length}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatTime(totalTimeSpent)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find((answer) => answer.questionId === question.id);
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="font-semibold mb-2">
                    Question {index + 1}: {question.question_text}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div
                        key={option}
                        className={`p-2 rounded ${
                          option === question.correct_option
                            ? 'bg-green-100'
                            : option === userAnswer?.selectedOption
                            ? 'bg-red-100'
                            : 'bg-gray-50'
                        }`}
                      >
                        {option}. {question[`option_${option.toLowerCase()}` as keyof Question]}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Explanation:</span> {question.explanation_text}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Time spent: {userAnswer?.timeSpent || 0} seconds
                  </div>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={onExit}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;