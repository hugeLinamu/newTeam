import { useState } from "react";
import { createRoot } from "react-dom/client";

interface MessageApi {
  info: (text: string) => void;
  success: (text: string) => void;
  warning: (text: string) => void;
  error: (text: string) => void;
}

interface List {
  text: string;
  key: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

let add: (list: List) => void
if (typeof document !== 'undefined') {
  let el = document.getElementById('#message-wrap');
  // 这一步是必要的的，因为在执行到这里的时候，页面还没有挂载，所以获取不到el节点
  if (!el) {
    el = document.createElement('div')
    el.className = 'message-wrap'
    el.id = 'message-wrap'
    document.body.append(el)
  }
  const root = createRoot(document.getElementById("message-wrap") as HTMLElement)
  root.render(<MessageContainer />)
} else {
  console.log('document is not defined');
}

// 获取唯一id
const getId = () => {
  return (Math.random() * 1000).toFixed()
}

function Message({ type, text }: { type: string, text: string }) {
  let bgc = ''
  let color = ''
  switch (type) {
    case "info":
      bgc = "bg-blue-500"
      color = "text-blue-500"
      break;
    case "error":
      bgc = "bg-red-500"
      color = "text-red-500"
      break;
    case "warning":
      bgc = "bg-yellow-500 "
      color = "text-yellow-500"
      break;
    case "success":
      bgc = "bg-green-500 "
      color = "text-green-500"
      break;
  }
  return (
    <div className={`h-8  min-w-[180px] text-[12px] mt-5 flex items-center rounded px-[10px] py-[0] bg-white shadow-md border-gray-400 ${color} `}>
      <span className={` w-2 h-2 mr-1 rounded-full ${bgc}`} />
      <span>{text}</span>
    </div>
  );
};

// 暴露的message-API
const $message: MessageApi = {
  info: (text) => {
    add({
      text,
      key: getId(),
      type: 'info'
    })
  },
  success: (text) => {
    add({
      text,
      key: getId(),
      type: 'success'
    })
  },
  warning: (text) => {
    add({
      text,
      key: getId(),
      type: 'warning'
    })
  },
  error: (text) => {
    add({
      text,
      key: getId(),
      type: 'error'
    })
  }
}
export default $message

export function MessageContainer(props: {}) {
  const [lists, setList] = useState<List[]>([]);
  const remove = (option: List) => {
    const { key } = option
    setList(() => {
      return lists.filter((each: List) => key !== each.key)
    })
  }

  add = (option: List) => {
    setList((preOption: List[]) => {
      const obj = [...preOption, option]
      setTimeout(() => {
        remove(option)
      }, 3000)
      return obj
    })
  }
  return (
    <>
      <div className="fixed z-999 left-1/2 top-[60px] -translate-x-1/2">
        {lists.map(({ text, key, type }) => (
          <Message key={key} type={type} text={text} />
        ))}
      </div>
    </>
  )
}