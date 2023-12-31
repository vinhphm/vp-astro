import clsx from 'clsx'

type Props = {
  className: string
}

export default function MusicEqualizer({ className }: Props) {
  return (
    <div className={clsx(className, 'flex h-3 w-4 items-center gap-0.75')}>
      <span className="h-3 w-0.75 animate-shrink rounded-sm bg-spotify-green" />
      <span className="h-1.5 w-0.75 animate-expand rounded-sm bg-spotify-green" />
      <span className="h-3 w-0.75 animate-shrink rounded-sm bg-spotify-green" />
    </div>
  )
}
