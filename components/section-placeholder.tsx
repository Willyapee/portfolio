type Props = { id: string; index: number; title: string };

export default function SectionPlaceholder({ id, index, title }: Props) {
  return (
    <section id={id} className="placeholder">
      <div className="placeholder-box glass px">
        <p className="placeholder-index">{"// "}{String(index).padStart(2, "0")}</p>
        <h2>{title}</h2>
        <p className="placeholder-note">
          <span className="status-dot" aria-hidden="true" /> UNDER CONSTRUCTION — COMING SOON
        </p>
      </div>
    </section>
  );
}
