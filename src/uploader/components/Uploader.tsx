import ImporterRequirements from './ImporterRequirements';
import FileUploader from './FileUploader';
import { getImporterRequirements } from '../utils';
import { useTranslations } from '@/i18';
import { useImporterDefinition } from '@/importer/hooks';
import { useEffect } from 'preact/hooks';

interface Props {
  onFileUploaded: (file: File) => void;
  onEnterDataManually: () => void;
  customFile: File | null;
}

export default function Uploader({
  onFileUploaded,
  onEnterDataManually,
  customFile
}: Props) {
  const { sheets } = useImporterDefinition();
  const importerRequirements = getImporterRequirements(sheets);
  const { t } = useTranslations();

  useEffect(() => {
    if (customFile) {
      onFileUploaded(customFile);
    }
  }, [customFile]);

  return (
    <>
    { !customFile && <div className="flex h-full flex-col space-y-4">
      <div className="flex-none text-2xl">{t('uploader.uploadAFile')}</div>
      <div className="flex-auto md:min-h-0">
        <div className="flex h-full flex-col-reverse gap-5 md:flex-row">
          <div className="h-full flex-1 lg:flex-1">
            <ImporterRequirements importerRequirements={importerRequirements} />
          </div>
          <div className="flex-1 lg:flex-2">
            <FileUploader
              setFile={onFileUploaded}
              onEnterDataManually={onEnterDataManually}
            />
          </div>
        </div>
      </div>
    </div>}
    </>
  );
}
