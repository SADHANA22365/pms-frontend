import Modal from "./Modal";
import Field from "./Field";
import { createUser, updateUser } from "../api/users";
import { fieldErrorsOf } from "../api/client";
import { useApiMutation } from "../lib/hooks";
import { useFields } from "../lib/useFields";
import { blankToUndefined, formatEnum } from "../lib/format";
import { btn, btnPrimary, input } from "../lib/ui";
import { DESIGNATIONS, type Designation } from "../types/enums";
import type { UserRequest, UserResponse } from "../types/api";

export default function UserFormModal({
  user,
  onClose,
}: {
  user?: UserResponse; // present = edit, absent = create
  onClose: () => void;
}) {
  const { values, bind } = useFields({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    designation: user?.designation ?? "DEVELOPER",
    phoneNumber: user?.phoneNumber ?? "",
    bio: user?.bio ?? "",
    location: user?.location ?? "",
  });

  const save = useApiMutation(
    () => {
      const body: UserRequest = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        designation: values.designation as Designation,
        phoneNumber: blankToUndefined(values.phoneNumber),
        bio: blankToUndefined(values.bio),
        location: blankToUndefined(values.location),
      };
      return user ? updateUser(user.id, body) : createUser(body);
    },
    user ? "User updated" : "User created",
    onClose,
  );
  const fe = fieldErrorsOf(save.error);

  return (
    <Modal title={user ? "Edit user" : "New user"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Full name" error={fe.fullName}>
            <input className={input} required {...bind("fullName")} />
          </Field>
          <Field label="Email" error={fe.email}>
            <input type="email" className={input} required {...bind("email")} />
          </Field>
        </div>

        <Field label="Designation" error={fe.designation}>
          <select className={input} {...bind("designation")}>
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>
                {formatEnum(d)}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Phone (optional)" error={fe.phoneNumber}>
            <input type="tel" className={input} {...bind("phoneNumber")} />
          </Field>
          <Field label="Location (optional)" error={fe.location}>
            <input className={input} {...bind("location")} />
          </Field>
        </div>

        <Field label="Bio (optional)" error={fe.bio}>
          <textarea rows={3} className={input} {...bind("bio")} />
        </Field>

        <div className="sticky bottom-0 -mx-5 -mb-4 mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-border bg-white px-5 py-3.5">
          <button type="button" className={btn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
