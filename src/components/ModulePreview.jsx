import useModuleBySubjectAndId from '../hooks/useModuleBySubjectAndId';
import useTextByModuleId from '../hooks/useTextByModuleId';
import useQuestionsByModuleId from '../hooks/useQuestionsByModuleId';
import '../styles/ModulePreview.css';

const ModulePreview = ({ subject, id, moduleSummary }) => {
  const moduleData = useModuleBySubjectAndId(subject, id);
  const text = useTextByModuleId(id);
  const questions = useQuestionsByModuleId(id);

  const moduleInfo = moduleData?.targetModule?.[0];

  if (!text || !questions || !moduleInfo) {
    return (
      <article className='ModulePreview ModulePreview--loading'>
        <span className='instrument-badge'>SYNCING MODULE {id}…</span>
      </article>
    );
  }

  const uniqueStandards = Array.from(
    new Set(
      questions.questions.flatMap((question) => question.alignedStandards || [])
    )
  );
  const moduleIndex = String(moduleInfo.id).padStart(2, '0');
  const genreLabel = text.text.genre
    ? text.text.genre.toUpperCase()
    : 'PASSAGE';

  const activeDraft = moduleSummary?.activeDraft || null;
  const draftAnsweredCount = activeDraft
    ? Object.keys(activeDraft.responses || {}).length
    : 0;
  const attemptCount = moduleSummary?.attemptCount || 0;
  const hasBestScore =
    attemptCount > 0 && moduleSummary?.bestOverall !== null;

  const ctaLabel =
    draftAnsweredCount > 0
      ? `RESUME ATTEMPT #${activeDraft.attemptNumber} →`
      : attemptCount > 0
        ? `START ATTEMPT #${attemptCount + 1} →`
        : 'BEGIN MODULE →';

  return (
    <article className='ModulePreview'>
      <div className='ModulePreview-top'>
        <div className='ModulePreview-badges'>
          <span className='ModulePreview-index instrument-badge'>
            MODULE {moduleIndex}
          </span>
          <span className='ModulePreview-genre instrument-badge'>
            {genreLabel}
          </span>
        </div>

        <div className='ModulePreview-status-group'>
          {draftAnsweredCount > 0 && (
            <span className='ModulePreview-draft instrument-badge'>
              IN PROGRESS {draftAnsweredCount}/{questions.questions.length}
            </span>
          )}
          {hasBestScore && (
            <span className='ModulePreview-score instrument-badge'>
              BEST {(Number(moduleSummary.bestOverall) * 100).toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      <div className='ModulePreview-heading'>
        <span className='ModulePreview-category instrument-badge'>
          {moduleInfo.moduleName}
        </span>
        <h2 className='ModulePreview-passage-title'>
          “{text.text.title}”
          {text.text.publicationDate ? ` (${text.text.publicationDate})` : ''}
        </h2>
        {text.text.author && (
          <p className='ModulePreview-author'>By {text.text.author}</p>
        )}
      </div>

      <div className='ModulePreview-teks-block'>
        <span className='ModulePreview-teks-label instrument-badge'>
          {questions.questions.length} QUESTIONS // ALIGNED TEKS
        </span>
        <ul className='ModulePreview-teks-list'>
          {uniqueStandards.map((std) => (
            <li key={std} className='ModulePreview-teks-chip instrument-badge'>
              {std}
            </li>
          ))}
        </ul>
      </div>

      <div className='ModulePreview-footer'>
        <span className='ModulePreview-cta instrument-badge'>{ctaLabel}</span>
        {attemptCount > 0 && (
          <span className='ModulePreview-attempts-note instrument-badge'>
            {attemptCount} COMPLETED
          </span>
        )}
      </div>
    </article>
  );
};

export default ModulePreview;
