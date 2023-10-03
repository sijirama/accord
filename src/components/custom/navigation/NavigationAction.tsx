import { Plus } from 'lucide-react';

export function NavigationAction() {
    return (
        <button className='group flex items-center'>
            <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-700 cursor-pointer">
                <Plus
                    className="group-hover:text-white transition text-emerald-700 font-bold"
                    size={25}
                />
            </div>
        </button>
    );
}
