import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon, ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { Console, Hook, Unhook } from 'console-feed'
import { Message as MessageComponent } from 'console-feed/lib/definitions/Component';
import { Message as MessageType } from 'console-feed/lib/definitions/Console';
import { isDarkThemeEnabled } from '../ToggleThemeSwitch';
import { useEventListenerWindow } from '../../hooks/useEventListener';
import { isBrowser } from '../../shared/lib/utilities';

const DEFAULT_LOGS_EXPANDED = true;
const DEFAULT_DISPLAY_LOGS = true;
const DEFAULT_DISPLAY_WARNINGS = true;
const DEFAULT_DISPLAY_ERRORS = true;

export const LogPanel = ({ }) => {
    const [logsExpanded, setLogsExpanded] = useState<boolean>(isBrowser ? (localStorage.getItem('logsExpanded') ? localStorage.getItem('logsExpanded') === "true" : DEFAULT_LOGS_EXPANDED) : DEFAULT_LOGS_EXPANDED);
    const [displayLogs, setDisplayLogs] = useState<boolean>(isBrowser ? (localStorage.getItem('displayLogs') ? localStorage.getItem('displayLogs') === "true" : DEFAULT_DISPLAY_LOGS) : DEFAULT_DISPLAY_LOGS);
    const [displayWarnings, setDisplayWarnings] = useState<boolean>(isBrowser ? (localStorage.getItem('displayWarnings') ? localStorage.getItem('displayWarnings') === "true" : DEFAULT_DISPLAY_WARNINGS) : DEFAULT_DISPLAY_WARNINGS);
    const [displayErrors, setDisplayErrors] = useState<boolean>(isBrowser ? (localStorage.getItem('displayErrors') ? localStorage.getItem('displayErrors') === "true" : DEFAULT_DISPLAY_ERRORS) : DEFAULT_DISPLAY_ERRORS);
    const [logFilter, setLogFilter] = useState<string[]>([]);

    const [logs, setLogs] = useState<MessageType[]>([]);
    const [darkThemeEnabled, setDarkThemeEnabled] = useState(isDarkThemeEnabled());

    useEventListenerWindow("darkThemeChanged", (evt) => {
        setDarkThemeEnabled(evt.detail);
    });

    useEffect(() => {
        let newLogFilter: string[] = [];
        if (displayLogs) {
            newLogFilter.push('log');
        }
        if (displayWarnings) {
            newLogFilter.push('warn');
        }
        if (displayErrors) {
            newLogFilter.push('error');
        }

        localStorage.setItem('displayLogs', displayLogs.toString());
        localStorage.setItem('displayWarnings', displayWarnings.toString());
        localStorage.setItem('displayErrors', displayErrors.toString());

        setLogFilter(newLogFilter);
    }, [displayLogs, displayWarnings, displayErrors])

    useEffect(() => {
        const hookedConsole = Hook(
            window.console,
            (log) => {
                setLogs((currLogs) => [...currLogs, log])
            },
            false
        )
        return () => { Unhook(hookedConsole); }
    }, [])

    return (
        <div className='flex flex-col mb-8 w-full max-w-4xl bg-slate-200 dark:bg-neutral-900 rounded-md items-center border-b-4 border-blue-300 dark:border-indigo-800'>
            <div className='flex gap-1 w-full justify-center bg-blue-300/40 dark:bg-indigo-900 rounded-t-md p-2'>
                <h2 className='font-semibold text-xl h-8'>{<ExclamationTriangleIcon className='w-6 h-6 inline-block mr-1 relative' />}Tester Logs</h2>
                <button className='transition-all opacity-90 hover:opacity-100' onClick={e => { localStorage.setItem('logsExpanded', (!logsExpanded).toString()); setLogsExpanded(!logsExpanded); }}>
                    <ChevronRightIcon className={`w-6 h-6 scale-y-75 ${logsExpanded ? 'rotate-90' : 'rotate-0'} text-slate-800 dark:text-slate-100 transition-transform`} />
                </button>
            </div>

            <div className='flex gap-4 bg-slate-300 dark:bg-slate-700 rounded-md py-2 px-4 my-4'>
                <div className='text-red-700 dark:text-red-400'>
                    <input id="showErrorsCheckbox" type='checkbox' className='mr-1' checked={displayErrors} onChange={(e) => { setDisplayErrors(e.target.checked) }} />
                    <label htmlFor="showErrorsCheckbox" className=''>Errors</label>
                </div>
                <div className='text-yellow-700 dark:text-yellow-400'>
                    <input id="showWarningsCheckbox" type='checkbox' className='mr-1' checked={displayWarnings} onChange={(e) => { setDisplayWarnings(e.target.checked) }} />
                    <label htmlFor="showWarningsCheckbox" className=''>Warnings</label>
                </div>
                <div className='items-center'>
                    <input id="showLogCheckbox" type='checkbox' className='mr-1' checked={displayLogs} onChange={(e) => { setDisplayLogs(e.target.checked) }} />
                    <label htmlFor="showLogCheckbox" className=''>Logs</label>
                </div>
            </div>

            <div className={`overflow-auto w-full flex flex-col-reverse relative transition-all ${logsExpanded ? 'max-h-96' : 'max-h-16'}`}>
                <div className='overflow-y-scroll flex flex-col-reverse'>
                    <Console filter={logFilter as any} logs={logs as MessageComponent[]} variant={darkThemeEnabled ? 'dark' : 'light'} />
                </div>
                <div className='h-6 pointer-events-none absolute top-0 w-full bg-gradient-to-b to-transparent from-slate-200 dark:from-neutral-900'></div>
            </div>
        </div>
    )
}