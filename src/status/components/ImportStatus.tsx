import Completed from './Completed';
import Failed from './Failed';
import Uploading from './Uploading';
import { useImporterState } from '@/importer/reducer';
import { EnumLabelDict } from '@/types';

interface Props {
  onRetry: () => void;
  onBackToPreview: () => void;
  resetState: () => void;
  enumLabelDict: EnumLabelDict;
  skipSummary: boolean;
}

export default function ImportStatus({
  onRetry,
  onBackToPreview,
  resetState,
  enumLabelDict,
  skipSummary
}: Props) {
  const { mode } = useImporterState();

  return (
    <div className="h-full">
      {mode === 'submit' && <Uploading resetState={resetState} />}

      {mode === 'failed' && (
        <Failed
          onRetry={onRetry}
          onBackToPreview={onBackToPreview}
          enumLabelDict={enumLabelDict}
        />
      )}

      {mode === 'completed' && (
        <Completed skipSummary={skipSummary} resetState={resetState} enumLabelDict={enumLabelDict} />
      )}
    </div>
  );
}
