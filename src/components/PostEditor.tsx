import React, { useState, useEffect, useRef } from "react";
import { Save, X } from "lucide-react";
import { Post } from "../types";

interface PostEditorProps {
  post?: Post | null;
  categoryName: string;
  subcategoryName: string;
  onSave: (title: string, content: string, writer: string) => void;
  onCancel: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  post,
  categoryName,
  subcategoryName,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const minHeight = 120; // 최소 높이(px)
  const maxHeight = 480; // 최대 높이(px)

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setWriter(post.writer);
    }
  }, [post]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      let newHeight = textareaRef.current.scrollHeight;
      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;
      textareaRef.current.style.height = newHeight + "px";
    }
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      let newHeight = textareaRef.current.scrollHeight;
      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;
      textareaRef.current.style.height = newHeight + "px";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim() && writer.trim()) {
      onSave(title.trim(), content.trim(), writer.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {post ? "글 수정" : "새 글 작성"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {categoryName} &gt; {subcategoryName}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            ref={textareaRef}
            rows={6}
            style={{
              minHeight: minHeight,
              maxHeight: maxHeight,
              overflowY: "auto",
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="내용을 입력하세요. 마크다운 문법을 사용할 수 있습니다."
            required
          />
        </div>

        <div>
          <label
            htmlFor="writer"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            작성자
          </label>
          <input
            type="text"
            id="writer"
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="작성자를 입력하세요"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Save className="w-4 h-4 text-emerald-100 group-hover:text-emerald-200" />
            <span>{post ? "수정 완료" : "게시하기"}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
            <span>취소</span>
          </button>
        </div>
      </form>
    </div>
  );
};
