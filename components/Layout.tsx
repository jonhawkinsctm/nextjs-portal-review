import Link from 'next/link';
import { PropsWithChildren, ReactElement, ReactNode } from 'react';

export function Layout(
    props: PropsWithChildren<{
        current?: 'home' | 'ssr' | 'swr';
        sidebar?: ReactNode;
    }>,
) {
    return (
        <div className="layout">
            <nav className="nav-bar">
                <ul>
                    <li className={props.current === 'home' ? 'active' : ''}>
                        <Link href="/">Home</Link>
                    </li>
                    <li className={props.current === 'ssr' ? 'active' : ''}>
                        <Link href="/ssr/dogs">SSR Dogs</Link>
                    </li>
                    <li className={props.current === 'swr' ? 'active' : ''}>
                        <Link href="/swr/dogs">SWR Dogs</Link>
                    </li>
                </ul>
            </nav>
            <main>{props.children}</main>
            {props.sidebar && <aside>{props.sidebar}</aside>}
        </div>
    );
}
