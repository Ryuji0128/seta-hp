import { describe, expect, it } from "vitest";
import {
  resourceEditorReducer,
  type ResourceEditorState,
} from "@/lib/hooks/useResourceEditor";

type Resource = { id: number; name: string };
type Form = { name: string; published: boolean };

const emptyForm = (): Form => ({ name: "", published: true });
const initialState = (): ResourceEditorState<Resource, Form> => ({
  dialogOpen: false,
  selectedResource: null,
  form: emptyForm(),
});

describe("resourceEditorReducer", () => {
  it("作成開始時に選択リソースとフォームをリセットする", () => {
    const state = resourceEditorReducer(initialState(), {
      type: "create",
      form: emptyForm(),
    });

    expect(state).toEqual({ dialogOpen: true, selectedResource: null, form: emptyForm() });
  });

  it("編集対象とフォームを保持し、フィールドを型付きで更新する", () => {
    const resource = { id: 7, name: "既存" };
    const editing = resourceEditorReducer(initialState(), {
      type: "edit",
      resource,
      form: { name: resource.name, published: false },
    });
    const changed = resourceEditorReducer(editing, {
      type: "set-field",
      field: "name",
      value: "更新後",
    });

    expect(changed.form).toEqual({ name: "更新後", published: false });
    expect(changed.selectedResource).toBe(resource);
  });

  it("closeでダイアログ・選択リソース・フォームを初期化する", () => {
    const editing: ResourceEditorState<Resource, Form> = {
      dialogOpen: true,
      selectedResource: { id: 1, name: "既存" },
      form: { name: "編集中", published: false },
    };

    expect(resourceEditorReducer(editing, { type: "close", form: emptyForm() }))
      .toEqual(initialState());
  });
});
