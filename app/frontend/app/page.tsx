"use client"
import { useState, useEffect, useCallback } from 'react';

type Priority = 'low' | 'med' | 'high';

interface Todo {
  id: number;
  task: string;
  done?: boolean;
  prio?: Priority;
  time?: string;
}

const PRIO_COLORS: Record<Priority, string> = {
  low: '#00ff88',
  med: '#ffbd2e',
  high: '#ff5f5f',
};

const PRIO_LABELS: Record<Priority, string> = {
  low: '[ LOW ]',
  med: '[ MED ]',
  high: '[ HIGH ]',
};

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30081';
const API_URL = "http://localhost:30081";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [prio, setPrio] = useState<Priority>('low');
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [uptime, setUptime] = useState('0s');
  const [clock, setClock] = useState('');
  const startTime = useState(() => Date.now())[0];

  const fetchTodos = useCallback(async () => {
    const res = await fetch(`${API_URL}/todos`);
    const data = await res.json();
    setTodos(data);
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-GB'));
      const up = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(up / 60), s = up % 60;
      setUptime(m > 0 ? `${m}m ${s}s` : `${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const addTodo = async () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    await fetch(`${API_URL}/todos?task=${encodeURIComponent(input)}&prio=${prio}&time=${time}`, {
      method: 'POST',
    });
    setInput('');
    fetchTodos();
  };

  const toggleDone = async (id: number) => {
    await fetch(`${API_URL}/todos/${id}/toggle`, { method: 'PATCH' });
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const filtered = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  const pendingCount = todos.filter(t => !t.done).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

        .terminal-page {
          min-height: 100vh;
          background: #0a0e0a;
          font-family: 'JetBrains Mono', monospace;
          color: #c8ffd4;
          padding: 2rem 1rem;
          position: relative;
        }
        .scanline {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px
          );
          pointer-events: none;
          z-index: 0;
        }
        .window {
          max-width: 680px;
          margin: 0 auto;
          background: #0d140d;
          border: 1px solid #1a2e1a;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        .titlebar {
          background: #111911;
          border-bottom: 1px solid #1a2e1a;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-r { background: #ff5f5f; }
        .dot-y { background: #ffbd2e; }
        .dot-g { background: #00ff88; }
        .win-title {
          margin-left: 8px;
          font-size: 12px;
          color: #5a8a6a;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .prompt-line {
          margin-left: auto;
          font-size: 11px;
          color: #5a8a6a;
          letter-spacing: 1px;
        }
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .body { padding: 1.5rem; }

        .sys-info {
          border: 1px solid rgba(0,255,136,0.12);
          border-radius: 4px;
          padding: 12px 16px;
          margin-bottom: 1.5rem;
          background: rgba(0,255,136,0.03);
        }
        .sys-line { font-size: 11px; color: #5a8a6a; line-height: 1.8; letter-spacing: 0.5px; }
        .sys-line span { color: #00ff88; }

        .input-label { font-size: 11px; color: #00cc66; letter-spacing: 1px; margin-bottom: 8px; display: block; }
        .input-row { display: flex; gap: 0; align-items: stretch; }
        .cmd-prefix {
          font-size: 13px;
          color: #00ff88;
          padding: 10px 10px;
          background: rgba(0,255,136,0.05);
          border: 1px solid rgba(0,255,136,0.18);
          border-right: none;
          border-radius: 4px 0 0 4px;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        .task-input {
          flex: 1;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,255,136,0.18);
          border-left: none;
          border-right: none;
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 10px 12px;
          outline: none;
          caret-color: #00ff88;
        }
        .task-input:focus { border-color: #00cc66; background: rgba(0,255,136,0.03); }
        .task-input::placeholder { color: #2a4a2a; }
        .add-btn {
          background: rgba(0,255,136,0.08);
          border: 1px solid #00cc66;
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          padding: 10px 16px;
          cursor: pointer;
          border-radius: 0 4px 4px 0;
          letter-spacing: 1px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .add-btn:hover { background: rgba(0,255,136,0.18); border-color: #00ff88; }

        .prio-row { display: flex; gap: 8px; align-items: center; margin-top: 10px; }
        .prio-label-txt { font-size: 10px; color: #2a4a2a; letter-spacing: 1px; }
        .prio-btn {
          width: 10px; height: 10px; border-radius: 50%;
          cursor: pointer; border: 2px solid transparent;
          transition: transform 0.15s, opacity 0.15s;
          opacity: 0.35;
          padding: 0;
        }
        .prio-btn:hover, .prio-btn.active { opacity: 1; transform: scale(1.4); }
        .prio-btn.active { border-color: rgba(255,255,255,0.4); }
        .prio-btn-low  { background: #00ff88; }
        .prio-btn-med  { background: #ffbd2e; }
        .prio-btn-high { background: #ff5f5f; }
        .prio-cur { font-size: 10px; color: #00cc66; letter-spacing: 1px; margin-left: 4px; }

        .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 1.25rem 0; }
        .stat {
          background: rgba(0,255,136,0.03);
          border: 1px solid #1a2e1a;
          border-radius: 4px;
          padding: 10px 12px;
          text-align: center;
        }
        .stat-num { font-size: 22px; font-weight: 700; line-height: 1; }
        .stat-lbl { font-size: 10px; color: #5a8a6a; letter-spacing: 1px; margin-top: 4px; text-transform: uppercase; }

        .divider { border: none; border-top: 1px solid #1a2e1a; margin: 0 0 1.25rem; }

        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .list-title { font-size: 11px; color: #00cc66; letter-spacing: 2px; text-transform: uppercase; }
        .filter-btns { display: flex; gap: 4px; }
        .fbtn {
          background: none;
          border: 1px solid #1a2e1a;
          color: #5a8a6a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 4px 10px;
          cursor: pointer;
          border-radius: 3px;
          letter-spacing: 1px;
          transition: all 0.15s;
        }
        .fbtn:hover, .fbtn.active { border-color: #00cc66; color: #00ff88; background: rgba(0,255,136,0.06); }

        .todo-list { display: flex; flex-direction: column; gap: 6px; min-height: 60px; }
        .todo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1px solid #1a2e1a;
          border-radius: 4px;
          background: rgba(0,0,0,0.2);
          transition: all 0.2s;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .todo-item:hover { border-color: rgba(0,255,136,0.18); background: rgba(0,255,136,0.03); }
        .todo-item.done { opacity: 0.5; }
        .todo-item.done .todo-text { text-decoration: line-through; color: #5a8a6a; }

        .check-btn {
          width: 18px; height: 18px;
          border: 1px solid #009944;
          border-radius: 2px;
          background: none;
          cursor: pointer;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
          padding: 0;
        }
        .check-btn:hover { border-color: #00ff88; background: rgba(0,255,136,0.1); }
        .check-btn.checked { background: #009944; border-color: #00ff88; }
        .checkmark { color: #00ff88; font-size: 11px; line-height: 1; }

        .prio-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .todo-id { font-size: 10px; color: #2a4a2a; flex-shrink: 0; min-width: 28px; }
        .todo-text { flex: 1; font-size: 13px; color: #c8ffd4; letter-spacing: 0.3px; }
        .todo-time { font-size: 10px; color: #2a4a2a; flex-shrink: 0; }
        .del-btn {
          background: none;
          border: 1px solid transparent;
          color: #2a4a2a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 3px 8px;
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.15s;
          flex-shrink: 0;
          letter-spacing: 1px;
        }
        .del-btn:hover { border-color: #ff4444; color: #ff6666; background: rgba(255,68,68,0.08); }

        .empty { text-align: center; padding: 2rem; color: #2a4a2a; font-size: 12px; letter-spacing: 1px; }

        .footer {
          padding: 10px 16px;
          border-top: 1px solid #1a2e1a;
          background: #111911;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-txt { font-size: 10px; color: #2a4a2a; letter-spacing: 1px; }
      `}</style>

      <div className="terminal-page">
        <div className="scanline" />
        <div className="window">

          {/* Title Bar */}
          <div className="titlebar">
            <div className="dot dot-r" />
            <div className="dot dot-y" />
            <div className="dot dot-g" />
            <span className="win-title">task_manager_v2.sh</span>
            <span className="prompt-line">bash ● <span className="blink">▌</span></span>
          </div>

          <div className="body">

            {/* System Info */}
            <div className="sys-info">
              <div className="sys-line">user@dev-machine: <span>~/projects/todos</span></div>
              <div className="sys-line">system: <span>GNU/Linux 6.1.0 x86_64</span> | uptime: <span>{uptime}</span></div>
              <div className="sys-line">status: <span>ACTIVE</span> | api: <span>localhost:8000</span></div>
            </div>

            {/* Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="input-label">// new task</span>
              <div className="input-row">
                <span className="cmd-prefix">$ add</span>
                <input
                  className="task-input"
                  value={input}
                  placeholder="type your task here..."
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTodo()}
                  autoComplete="off"
                />
                <button className="add-btn" onClick={addTodo}>[ EXEC ]</button>
              </div>

              {/* Priority Selector */}
              <div className="prio-row">
                <span className="prio-label-txt">priority:</span>
                {(['low', 'med', 'high'] as Priority[]).map(p => (
                  <button
                    key={p}
                    className={`prio-btn prio-btn-${p} ${prio === p ? 'active' : ''}`}
                    onClick={() => setPrio(p)}
                    title={p}
                  />
                ))}
                <span className="prio-cur">{PRIO_LABELS[prio]}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="stats">
              <div className="stat">
                <div className="stat-num" style={{ color: '#00ff88' }}>{total}</div>
                <div className="stat-lbl">total</div>
              </div>
              <div className="stat">
                <div className="stat-num" style={{ color: '#00cc66' }}>{doneCount}</div>
                <div className="stat-lbl">done</div>
              </div>
              <div className="stat">
                <div className="stat-num" style={{ color: '#ffbd2e' }}>{pendingCount}</div>
                <div className="stat-lbl">pending</div>
              </div>
            </div>

            <hr className="divider" />

            {/* List Header */}
            <div className="list-header">
              <span className="list-title">// process list</span>
              <div className="filter-btns">
                {(['all', 'pending', 'done'] as const).map(f => (
                  <button
                    key={f}
                    className={`fbtn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Todo List */}
            <div className="todo-list">
              {filtered.length === 0 ? (
                <div className="empty">[ ] no tasks found.</div>
              ) : (
                filtered.map(todo => (
                  <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
                    <button
                      className={`check-btn ${todo.done ? 'checked' : ''}`}
                      onClick={() => toggleDone(todo.id)}
                    >
                      {todo.done && <span className="checkmark">✓</span>}
                    </button>
                    <div
                      className="prio-dot"
                      style={{ background: PRIO_COLORS[(todo.prio as Priority) ?? 'low'] }}
                    />
                    <span className="todo-id">#{String(todo.id).padStart(3, '0')}</span>
                    <span className="todo-text">{todo.task}</span>
                    <span className="todo-time">{todo.time ?? ''}</span>
                    <button className="del-btn" onClick={() => deleteTodo(todo.id)}>[ rm ]</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <span className="footer-txt">process manager | localhost:8000</span>
            <span className="footer-txt">{clock}</span>
          </div>
        </div>
      </div>
    </>
  );
}