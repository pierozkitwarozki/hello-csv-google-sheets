import { Alert, Button } from '@/components';
import { useTranslations } from '@/i18';
import { EnumLabelDict } from '@/types';
import { getTotalRows } from '../utils';
import Summary from './Summary';
import { useImporterDefinition } from '@/importer/hooks';
import { useImporterState } from '@/importer/reducer';
import { useEffect } from 'preact/hooks';

interface Props {
  resetState: () => void;
  enumLabelDict: EnumLabelDict;
  skipSummary: boolean;
}

export default function Completed({ resetState, enumLabelDict, skipSummary }: Props) {
  const { sheetData, importStatistics: statistics } = useImporterState();
  const { onSummaryFinished } = useImporterDefinition();
  const { t } = useTranslations();

  const totalRecords = getTotalRows(sheetData);
  const recordsImported = statistics?.imported ?? 0;
  const completedWithErrors = !!statistics?.failed || !!statistics?.skipped;

  useEffect(() => { 
    if (!completedWithErrors && skipSummary) {
      (onSummaryFinished || resetState)?.();
    }
  }, [completedWithErrors, skipSummary]);

  return (
    <div className="flex flex-col">
      <div className="text-2xl">{t('importStatus.dataImport')}</div>
      <div className="mt-4">
        <Alert
          variant={completedWithErrors ? 'warning' : 'success'}
          header={t(
            `importStatus.${completedWithErrors ? 'importSuccessfulWithErrors' : 'importSuccessful'}`
          )}
          description={t(
            `importStatus.successDescription${statistics ? 'WithStats' : ''}`,
            {
              totalRecords,
              recordsImported,
            }
          )}
        />
      </div>
      {!skipSummary && <div className="mt-6">
        <Summary
          completedWithErrors={completedWithErrors}
          enumLabelDict={enumLabelDict}
        />
        <div className="mt-auto flex-none">
          <div className="mt-5 flex justify-end">
            <Button variant="primary" onClick={onSummaryFinished || resetState}>
              {t('importStatus.continue')}
            </Button>
          </div>
        </div>
      </div>}
    </div>
  );
}
