import { Button } from "@/components/ui/button";

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  showExplanation: boolean;
}

const QuizNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  showExplanation,
}: QuizNavigationProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={onNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
        >
          Next
        </Button>
      </div>
      <Button onClick={onSubmit}>
        {!showExplanation ? 'Check Answer' : 
          currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Show Next Question'}
      </Button>
    </div>
  );
};

export default QuizNavigation;