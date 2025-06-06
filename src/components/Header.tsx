import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

export default function Header({ page }: { page: string }) {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 h-4 w-[1px] bg-primary"
				/>
				<h1 className="text-xl capitalize">{page}</h1>
			</div>
		</header>
	)
}
