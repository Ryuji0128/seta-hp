"use client";

import { useCallback, useReducer } from "react";

export interface ResourceEditorState<T, FormState> {
  dialogOpen: boolean;
  selectedResource: T | null;
  form: FormState;
}

type ResourceEditorAction<T, FormState> =
  | { type: "create"; form: FormState }
  | { type: "edit"; resource: T; form: FormState }
  | { type: "set-field"; field: keyof FormState; value: FormState[keyof FormState] }
  | { type: "close"; form: FormState };

export function resourceEditorReducer<T, FormState>(
  state: ResourceEditorState<T, FormState>,
  action: ResourceEditorAction<T, FormState>
): ResourceEditorState<T, FormState> {
  switch (action.type) {
    case "create":
      return { dialogOpen: true, selectedResource: null, form: action.form };
    case "edit":
      return { dialogOpen: true, selectedResource: action.resource, form: action.form };
    case "set-field":
      return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "close":
      return { dialogOpen: false, selectedResource: null, form: action.form };
  }
}

interface UseResourceEditorOptions<T extends { id: number }, FormState> {
  createForm: () => FormState;
  editForm: (resource: T) => FormState;
  save: (form: FormState, id?: number) => Promise<boolean>;
}

/** 管理リソースの作成・編集ダイアログと保存成功後のリセットを一元管理する。 */
export function useResourceEditor<T extends { id: number }, FormState>({
  createForm,
  editForm,
  save,
}: UseResourceEditorOptions<T, FormState>) {
  const [state, dispatch] = useReducer(resourceEditorReducer<T, FormState>, {
    dialogOpen: false,
    selectedResource: null,
    form: createForm(),
  });

  const openCreate = useCallback(() => {
    dispatch({ type: "create", form: createForm() });
  }, [createForm]);

  const openEdit = useCallback((resource: T) => {
    dispatch({ type: "edit", resource, form: editForm(resource) });
  }, [editForm]);

  const close = useCallback(() => {
    dispatch({ type: "close", form: createForm() });
  }, [createForm]);

  const setField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    dispatch({ type: "set-field", field, value });
  }, []);

  const submit = useCallback(async () => {
    const ok = await save(state.form, state.selectedResource?.id);
    if (ok) {
      dispatch({ type: "close", form: createForm() });
    }
    return ok;
  }, [createForm, save, state.form, state.selectedResource]);

  return { ...state, openCreate, openEdit, close, setField, submit };
}
