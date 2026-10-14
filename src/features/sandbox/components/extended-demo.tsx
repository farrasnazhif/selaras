"use client";

import { useRef, useState, type ComponentType } from "react";
import {
  Bell,
  Check,
  Download,
  Mail,
  MoreHorizontal,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multi-select";
import { Slider } from "@/components/ui/slider";
import { NumberInput } from "@/components/ui/number-input";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { OtpInput } from "@/components/ui/otp-input";
import { Dropzone } from "@/components/ui/dropzone";
import { FileUploadList } from "@/components/ui/file-upload-list";
import { UploadProgress } from "@/components/ui/upload-progress";
import { ImagePreview } from "@/components/ui/image-preview";
import { IconButton } from "@/components/ui/icon-button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, type MenuAction } from "@/components/ui/dropdown-menu";
import { SplitButton } from "@/components/ui/split-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Stepper } from "@/components/ui/stepper";
import { CommandPalette } from "@/components/ui/command-palette";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Drawer } from "@/components/ui/drawer";
import { Popover } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible } from "@/components/ui/collapsible";
import { List } from "@/components/ui/list";
import { Table, type TableColumn } from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
import { DescriptionList } from "@/components/ui/description-list";
import { Timeline } from "@/components/ui/timeline";
import { Calendar } from "@/components/ui/calendar";
import { SnapshotChart } from "@/components/ui/snapshot-chart";
import { CopyButton } from "@/components/ui/copy-button";
import { SearchInput } from "@/components/ui/search-input";
import { FilterBar } from "@/components/ui/filter-bar";
import { Notice } from "@/components/ui/notice";
import { Switch } from "@/components/ui/switch";
import type { EXTENDED_COMPONENTS } from "../constants/extended-catalog";

const options = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "research", label: "Research" },
  { value: "archived", label: "Archived", disabled: true },
];
const skills = [
  "TypeScript",
  "React",
  "Python",
  "Go",
  "Rust",
  "Design",
  "Research",
];
const people = [
  { name: "Alex Chen" },
  { name: "Sam Rivera" },
  { name: "Jordan Lee" },
  { name: "Taylor Kim" },
  { name: "Morgan Park" },
];
const rows = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: ["Alex Chen", "Sam Rivera", "Jordan Lee", "Taylor Kim"][index % 4],
  role: ["Designer", "Engineer", "Researcher"][index % 3],
  tasks: (index * 7) % 13,
}));
const columns: TableColumn<(typeof rows)[number]>[] = [
  { id: "name", label: "Name", value: (row) => row.name },
  { id: "role", label: "Role", value: (row) => row.role },
  { id: "tasks", label: "Tasks", value: (row) => row.tasks },
];

function FormDemo({ kind }: { kind: string }) {
  const [value, setValue] = useState("design");
  const [checked, setChecked] = useState(true);
  const [number, setNumber] = useState<number | null>(3);
  const [range, setRange] = useState({
    start: "2026-10-11",
    end: "2026-10-13",
  });
  const [message, setMessage] = useState("");
  return (
    <div className="w-full max-w-md space-y-5">
      {kind === "select" && (
        <>
          <div className="field">
            <label htmlFor="select-demo">Team</label>
            <Select
              id="select-demo"
              options={options}
              value={value}
              onValueChange={(next) => next && setValue(next)}
            />
          </div>
          <div className="field">
            <label htmlFor="select-disabled">Disabled</label>
            <Select
              id="select-disabled"
              options={options}
              defaultValue="engineering"
              disabled
            />
          </div>
          <div className="field">
            <label htmlFor="select-invalid">Required team</label>
            <Select
              id="select-invalid"
              options={options}
              triggerProps={{
                "aria-invalid": true,
                "aria-describedby": "select-error",
              }}
            />
            <p id="select-error" className="field-error">
              Choose a team.
            </p>
          </div>
        </>
      )}
      {kind === "textarea" && (
        <>
          <div className="field">
            <label htmlFor="textarea-demo">Description</label>
            <Textarea
              id="textarea-demo"
              placeholder="Tell us about your idea…"
              maxLength={2000}
            />
          </div>
          <div className="field">
            <label htmlFor="textarea-invalid">Required description</label>
            <Textarea
              id="textarea-invalid"
              aria-invalid
              aria-describedby="textarea-error"
            />
            <p id="textarea-error" className="field-error">
              Add a description.
            </p>
          </div>
          <div className="field">
            <label htmlFor="textarea-disabled">Disabled</label>
            <Textarea
              id="textarea-disabled"
              disabled
              defaultValue="Read-only preview"
            />
          </div>
        </>
      )}
      {kind === "checkbox" && (
        <>
          <label className="ui-choice">
            <Checkbox checked={checked} onCheckedChange={setChecked} />
            Email notifications
          </label>
          <label className="ui-choice">
            <Checkbox indeterminate />
            Some items selected
          </label>
          <label className="ui-choice">
            <Checkbox />
            Optional preference
          </label>
          <label className="ui-choice">
            <Checkbox defaultChecked disabled />
            Disabled preference
          </label>
        </>
      )}
      {kind === "radio-group" && (
        <RadioGroup
          aria-label="Team"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      )}
      {kind === "combobox" && (
        <>
          <div className="field">
            <label htmlFor="combobox-demo">Skill</label>
            <Combobox options={skills} inputProps={{ id: "combobox-demo" }} />
          </div>
          <div className="field">
            <label htmlFor="combobox-disabled">Disabled</label>
            <Combobox
              options={skills}
              defaultValue="React"
              disabled
              inputProps={{ id: "combobox-disabled" }}
            />
          </div>
          <p className="text-xs text-muted">
            Try a search with no matches to see the empty state.
          </p>
        </>
      )}
      {kind === "multi-select" && (
        <>
          <div className="field">
            <label htmlFor="multi-demo">Skills</label>
            <MultiSelect
              options={skills}
              defaultValue={["React", "Design"]}
              inputProps={{ id: "multi-demo" }}
            />
          </div>
          <div className="field">
            <label htmlFor="multi-disabled">Disabled</label>
            <MultiSelect
              options={skills}
              defaultValue={["Python"]}
              disabled
              inputProps={{ id: "multi-disabled" }}
            />
          </div>
        </>
      )}
      {kind === "slider" && (
        <>
          <Slider label="Volume" defaultValue={65} />
          <Slider label="Disabled slider" defaultValue={30} disabled />
        </>
      )}
      {kind === "number-input" && (
        <>
          <div className="field">
            <label htmlFor="number-demo">Seats (1–10)</label>
            <NumberInput
              id="number-demo"
              min={1}
              max={10}
              value={number}
              onValueChange={setNumber}
            />
          </div>
          <div className="field">
            <label htmlFor="number-disabled">Disabled</label>
            <NumberInput id="number-disabled" defaultValue={5} disabled />
          </div>
        </>
      )}
      {kind === "date-picker" && (
        <>
          <div className="field">
            <label htmlFor="date-demo">Event date</label>
            <DatePicker id="date-demo" defaultValue="2026-10-11" />
          </div>
          <div className="field">
            <label htmlFor="date-disabled">Disabled</label>
            <DatePicker id="date-disabled" defaultValue="2026-10-11" disabled />
          </div>
        </>
      )}
      {kind === "date-range-picker" && (
        <>
          <DateRangePicker value={range} onValueChange={setRange} />
          <DateRangePicker value={range} onValueChange={setRange} disabled />
        </>
      )}
      {kind === "time-picker" && (
        <>
          <div className="field">
            <label htmlFor="time-demo">Start time</label>
            <TimePicker id="time-demo" defaultValue="09:30" />
          </div>
          <div className="field">
            <label htmlFor="time-disabled">Disabled</label>
            <TimePicker id="time-disabled" defaultValue="09:30" disabled />
          </div>
        </>
      )}
      {kind === "otp-input" && (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(
              "Sample code accepted. No verification request was sent.",
            );
          }}
        >
          <div className="field">
            <label htmlFor="otp-demo">Six-digit code</label>
            <OtpInput
              id="otp-demo"
              required
              placeholder="000000"
              aria-describedby="otp-hint"
            />
            <p id="otp-hint" className="text-xs text-muted">
              Paste or type six digits.
            </p>
          </div>
          <Button type="submit" variant="primary">
            Verify sample
          </Button>
          <div className="field">
            <label htmlFor="otp-disabled">Disabled</label>
            <OtpInput id="otp-disabled" defaultValue="123456" disabled />
          </div>
        </form>
      )}
      {message && (
        <p role="status" className="text-xs text-muted">
          {message}
        </p>
      )}
    </div>
  );
}

function UploadDemo({ imagesOnly = false }: { imagesOnly?: boolean }) {
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const nextId = useRef(0);
  return (
    <div className="w-full max-w-lg space-y-5">
      <Dropzone
        label={
          imagesOnly ? "Choose an image to preview" : "Drop your files here"
        }
        accept={
          imagesOnly
            ? "image/png,image/jpeg,image/webp,image/gif,image/avif"
            : ".pdf,.txt,.csv,image/png,image/jpeg,image/webp"
        }
        maxSize={5 * 1024 * 1024}
        maxFiles={imagesOnly ? 1 : 5 - files.length}
        disabled={!imagesOnly && files.length >= 5}
        onFilesAccepted={(accepted) => {
          const next = accepted.map((file) => ({
            id: String(nextId.current++),
            file,
          }));
          setFiles((current) => (imagesOnly ? next : [...current, ...next]));
        }}
      />
      {!!files.length && (
        <FileUploadList
          files={files.map(({ id, file }) => ({
            id,
            name: file.name,
            size: file.size,
          }))}
          onRemove={(id) =>
            setFiles((current) => current.filter((entry) => entry.id !== id))
          }
        />
      )}
      {(imagesOnly ||
        files.some(({ file }) => file.type.startsWith("image/"))) && (
        <ImagePreview
          file={files.find(({ file }) => file.type.startsWith("image/"))?.file}
        />
      )}
      <p className="text-xs text-muted">
        Files stay in this preview. Nothing is uploaded.
      </p>
      {!imagesOnly && (
        <Dropzone
          disabled
          label="Disabled dropzone"
          onFilesAccepted={() => {}}
        />
      )}
    </div>
  );
}

function FileListDemo() {
  const initial = [
    { id: "1", name: "brief.pdf", size: 420_000, progress: 65 },
    { id: "2", name: "dataset.csv", size: 180_000, progress: 100 },
    {
      id: "3",
      name: "notes.txt",
      size: 1024,
      error: "Upload failed. Try again.",
    },
  ];
  const [files, setFiles] = useState(initial);
  return (
    <div className="w-full max-w-lg space-y-4">
      <FileUploadList
        files={files}
        onRemove={(id) =>
          setFiles((current) => current.filter((file) => file.id !== id))
        }
      />
      <Button onClick={() => setFiles(initial)}>Reset sample files</Button>
    </div>
  );
}

function UploadProgressDemo() {
  const [value, setValue] = useState(65);
  const [cancelled, setCancelled] = useState(false);
  return (
    <div className="w-full max-w-md space-y-5">
      <Slider
        label="Sample upload progress"
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setCancelled(false);
        }}
      />
      {cancelled ? (
        <Notice tone="info">Sample upload canceled.</Notice>
      ) : (
        <UploadProgress
          filename="brief.pdf"
          value={value}
          onCancel={() => setCancelled(true)}
        />
      )}
      <UploadProgress filename="completed.csv" value={100} />
      <UploadProgress
        filename="failed.txt"
        value={35}
        error="Connection interrupted. Your file is still available."
      />
      <p className="text-xs text-muted">
        Use the slider to preview progress; no network upload runs.
      </p>
    </div>
  );
}

function ActionDemo({ kind }: { kind: string }) {
  const [message, setMessage] = useState("");
  const actions: MenuAction[] = [
    {
      id: "download",
      label: "Download sample",
      icon: <Download size={14} />,
      onSelect: () => setMessage("Download action selected."),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={14} />,
      onSelect: () => setMessage("Settings action selected."),
    },
    {
      id: "disabled",
      label: "Unavailable action",
      disabled: true,
      onSelect: () => {},
    },
    {
      id: "delete",
      label: "Delete sample",
      icon: <Trash2 size={14} />,
      danger: true,
      onSelect: () => setMessage("Delete action selected."),
    },
  ];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {kind === "icon-button" && (
          <>
            <IconButton
              label="Notifications"
              onClick={() => setMessage("Notifications opened.")}
            >
              <Bell size={16} />
            </IconButton>
            <IconButton
              label="Add item"
              variant="primary"
              size="lg"
              onClick={() => setMessage("Item added.")}
            >
              <Plus size={18} />
            </IconButton>
            <IconButton label="Disabled action" disabled>
              <Settings size={16} />
            </IconButton>
            <IconButton label="Loading action" loading>
              <Download size={16} />
            </IconButton>
          </>
        )}
        {kind === "button-group" && (
          <ButtonGroup label="File actions">
            <Button onClick={() => setMessage("Saved.")}>Save</Button>
            <Button onClick={() => setMessage("Exported.")}>Export</Button>
            <Button disabled>Archive</Button>
          </ButtonGroup>
        )}
        {kind === "dropdown-menu" && (
          <DropdownMenu
            trigger={
              <Button>
                Actions <MoreHorizontal size={14} />
              </Button>
            }
            items={actions}
          />
        )}
        {kind === "split-button" && (
          <>
            <SplitButton
              variant="primary"
              items={actions}
              onClick={() => setMessage("Primary action selected.")}
            >
              Publish sample
            </SplitButton>
            <SplitButton items={actions} disabled>
              Disabled
            </SplitButton>
          </>
        )}
      </div>
      <p role="status" className="min-h-4 text-xs text-muted">
        {message}
      </p>
    </div>
  );
}

function NavigationDemo({ kind }: { kind: string }) {
  const [page, setPage] = useState(1);
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="w-full max-w-lg space-y-5">
      {kind === "breadcrumbs" && (
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Sandbox", href: "/sandbox" },
            { label: "Components" },
          ]}
        />
      )}
      {kind === "pagination" && (
        <>
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
          <Pagination page={1} pageCount={1} onPageChange={() => {}} disabled />
        </>
      )}
      {kind === "navigation-menu" && (
        <>
          <NavigationMenu
            items={[
              { label: "Sandbox", href: "/sandbox", active: true },
              { label: "Home", href: "/" },
              { label: "App", href: "/dashboard" },
            ]}
          />
          <p className="text-xs text-muted">
            These links navigate to their actual destinations.
          </p>
        </>
      )}
      {kind === "stepper" && (
        <>
          <Stepper steps={["Details", "Review", "Complete"]} current={step} />
          <div className="flex gap-2">
            <Button disabled={step === 0} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button disabled={step === 2} onClick={() => setStep(step + 1)}>
              Next
            </Button>
          </div>
        </>
      )}
      {kind === "command-palette" && (
        <>
          <Button onClick={() => setOpen(true)}>Open commands</Button>
          <CommandPalette
            open={open}
            onOpenChange={setOpen}
            commands={[
              {
                id: "new",
                label: "Create a sample item",
                onSelect: () => setMessage("Sample item created."),
              },
              {
                id: "copy",
                label: "Show sharing details",
                onSelect: () => setMessage("Sharing details opened."),
              },
              {
                id: "export",
                label: "Export sample data",
                onSelect: () => setMessage("Export command selected."),
              },
            ]}
          />
          <p role="status" className="text-xs text-muted">
            {message}
          </p>
        </>
      )}
    </div>
  );
}

function OverlayDemo({ kind }: { kind: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(true);
  return (
    <div className="space-y-4">
      {kind === "alert-dialog" && (
        <>
          <AlertDialog
            title="Delete this sample?"
            description="This demo only changes local preview state."
            open={open}
            onOpenChange={setOpen}
            trigger={<Button variant="danger">Delete sample</Button>}
          >
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false);
                setMessage("Sample deleted.");
              }}
            >
              Delete sample
            </Button>
          </AlertDialog>
          <p role="status" className="text-xs text-muted">
            {message}
          </p>
        </>
      )}
      {kind === "drawer" && (
        <Drawer
          title="Preferences"
          description="A side panel using the same surfaces and controls."
          trigger={<Button>Open drawer</Button>}
        >
          <label className="ui-choice justify-between">
            Notifications
            <Switch checked={checked} onCheckedChange={setChecked} />
          </label>
          <div className="field mt-5">
            <label htmlFor="drawer-name">Display name</label>
            <Input id="drawer-name" defaultValue="Alex Chen" />
          </div>
        </Drawer>
      )}
      {kind === "popover" && (
        <Popover
          title="Display options"
          trigger={
            <Button>
              Display options <Settings size={14} />
            </Button>
          }
        >
          <label className="ui-choice justify-between">
            Show details
            <Switch checked={checked} onCheckedChange={setChecked} />
          </label>
        </Popover>
      )}
      {kind === "tooltip" && (
        <div className="flex gap-3">
          <Tooltip content="Notifications">
            <IconButton label="Notifications">
              <Bell size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip content="Account settings">
            <IconButton label="Account settings">
              <Settings size={16} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

function ToastActions() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast.add({
            title: "Saved successfully",
            description: "Your sample changes are ready.",
            type: "success",
          })
        }
      >
        Success toast
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: "Something went wrong",
            description: "Your input is preserved. Try again.",
            type: "error",
            priority: "high",
          })
        }
      >
        Error toast
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: "Check your changes",
            description: "Some sample fields still need attention.",
            type: "warning",
          })
        }
      >
        Warning toast
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: "New update available",
            description: "This is a sample notification.",
            type: "info",
          })
        }
      >
        Info toast
      </Button>
    </div>
  );
}

function FeedbackDemo({ kind }: { kind: string }) {
  const [value, setValue] = useState(65);
  const [created, setCreated] = useState(false);
  return (
    <div className="w-full max-w-md space-y-5">
      {kind === "progress-bar" && (
        <>
          <Slider
            label="Progress value"
            value={value}
            onValueChange={setValue}
          />
          <ProgressBar label="Processing" value={value} />
          <ProgressBar label="Complete" value={100} />
          <ProgressBar label="Waiting" value={null} />
        </>
      )}
      {kind === "spinner" && (
        <div className="flex flex-wrap items-center gap-6">
          <Spinner label="Loading data" />
          <Spinner label="Preparing preview" size={28} />
        </div>
      )}
      {kind === "skeleton" && (
        <Card>
          <div role="status" className="space-y-4">
            <span className="sr-only">Loading content</span>
            <div className="flex gap-3">
              <Skeleton className="size-10 !rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </Card>
      )}
      {kind === "empty-state" &&
        (created ? (
          <Card>
            <p role="status" className="text-sm">
              Sample item created.
            </p>
            <Button className="mt-4" onClick={() => setCreated(false)}>
              Reset preview
            </Button>
          </Card>
        ) : (
          <EmptyState
            title="No items yet"
            description="Create your first item to get started."
            action={
              <Button variant="primary" onClick={() => setCreated(true)}>
                <Plus size={14} />
                Create item
              </Button>
            }
          />
        ))}
    </div>
  );
}

function ContentDemo({ kind }: { kind: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="w-full max-w-lg space-y-5">
      {kind === "avatar" && (
        <div className="flex items-center gap-4">
          <Avatar name="Alex Chen" size="sm" />
          <Avatar name="Sam Rivera" />
          <Avatar name="Jordan Lee" size="lg" />
          <Avatar
            name="Broken image fallback"
            src="data:image/png;base64,invalid"
          />
        </div>
      )}
      {kind === "avatar-group" && <AvatarGroup people={people} max={3} />}
      {kind === "card" && (
        <Card>
          <div className="flex items-center gap-3">
            <Avatar name="Alex Chen" />
            <div>
              <h3 className="text-sm font-medium">
                A place for your next idea
              </h3>
              <p className="mt-1 text-xs text-muted">
                Shared surfaces, spacing, and type.
              </p>
            </div>
          </div>
          <Separator className="my-5" />
          <p className="text-xs leading-relaxed text-muted">
            Use this surface for dashboard summaries, settings, profiles, or
            feature content.
          </p>
          <Button
            className="mt-5"
            variant="primary"
            onClick={() => setSaved(!saved)}
          >
            {saved ? <Check size={14} /> : <Plus size={14} />}
            {saved ? "Saved" : "Save sample"}
          </Button>
        </Card>
      )}
      {kind === "accordion" && (
        <Accordion
          defaultValue={["start"]}
          items={[
            {
              id: "start",
              title: "How do I get started?",
              content:
                "Import a component from /ui and pass your data and callbacks.",
            },
            {
              id: "styles",
              title: "Can I customize the style?",
              content:
                "All components share surface, radius, type, and accent tokens in globals.css.",
            },
            {
              id: "disabled",
              title: "Unavailable section",
              content: "",
              disabled: true,
            },
          ]}
        />
      )}
      {kind === "separator" && (
        <Card>
          <p className="text-xs">Section one</p>
          <Separator className="my-4" />
          <div className="flex h-8 items-center gap-4 text-xs">
            <span>Details</span>
            <Separator orientation="vertical" />
            <span>Activity</span>
          </div>
        </Card>
      )}
      {kind === "scroll-area" && (
        <ScrollArea label="Sample activity">
          <List
            label="Activity entries"
            items={Array.from({ length: 15 }, (_, index) => ({
              id: String(index),
              title: `Activity item ${index + 1}`,
              description: "A row in the scrollable sample list.",
              leading: <Mail size={15} className="text-muted" />,
            }))}
          />
        </ScrollArea>
      )}
      {kind === "collapsible" && (
        <Collapsible label="Advanced details">
          <Card>
            <DescriptionList
              items={[
                { label: "Environment", value: "Preview" },
                { label: "Region", value: "Asia Pacific" },
              ]}
            />
          </Card>
        </Collapsible>
      )}
      {kind === "list" && (
        <List
          label="Team members"
          items={people.slice(0, 3).map((person, index) => ({
            id: person.name,
            title: person.name,
            description: ["Designer", "Engineer", "Researcher"][index],
            leading: <Avatar {...person} />,
            trailing: (
              <IconButton
                label={`Options for ${person.name}`}
                variant="quiet"
                onClick={() => setSaved(true)}
              >
                <MoreHorizontal size={14} />
              </IconButton>
            ),
          }))}
        />
      )}
      {kind === "list" && saved && (
        <p role="status" className="text-xs text-muted">
          Member action selected.
        </p>
      )}
    </div>
  );
}

function DataDemo({ kind }: { kind: string }) {
  const [date, setDate] = useState("2026-10-11");
  const [grid, setGrid] = useState(true);
  return (
    <div className="w-full max-w-2xl space-y-5">
      {kind === "table" && (
        <>
          <Table
            caption="Team members"
            rows={rows.slice(0, 4)}
            columns={columns}
            getRowId={(row) => row.id}
          />
          <Table
            caption="Empty table"
            rows={[]}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </>
      )}
      {kind === "data-table" && (
        <DataTable
          caption="Team members"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
        />
      )}
      {kind === "description-list" && (
        <DescriptionList
          items={[
            { label: "Name", value: "Alex Chen" },
            { label: "Email", value: "alex@example.com" },
            { label: "Role", value: "Designer" },
            { label: "Skills", value: "Design, React, TypeScript" },
          ]}
        />
      )}
      {kind === "timeline" && (
        <Timeline
          items={[
            {
              id: "created",
              title: "Project created",
              description: "Alex started a new idea.",
              time: "October 11 · 9:00 AM",
              dateTime: "2026-10-11T09:00:00+07:00",
            },
            {
              id: "reviewed",
              title: "Design reviewed",
              description: "The team agreed on the first scope.",
              time: "October 11 · 10:30 AM",
              dateTime: "2026-10-11T10:30:00+07:00",
            },
            {
              id: "ready",
              title: "Ready to build",
              time: "October 11 · 11:00 AM",
              dateTime: "2026-10-11T11:00:00+07:00",
            },
          ]}
        />
      )}
      {kind === "calendar" && (
        <>
          <Calendar
            value={date}
            onValueChange={setDate}
            initialMonth="2026-10"
          />
          <p role="status" className="text-xs text-muted">
            Selected: {date}. Use arrow keys to move between days.
          </p>
          <Calendar
            value={date}
            onValueChange={setDate}
            initialMonth="2026-10"
            disabled
          />
        </>
      )}
      {kind === "charts" && (
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-medium">Weekly activity</h3>
            <label className="ui-choice">
              Grid
              <Switch checked={grid} onCheckedChange={setGrid} />
            </label>
          </div>
          <div className="h-48">
            <SnapshotChart
              grid={grid}
              series={[
                {
                  id: "Activity",
                  color: "var(--accent)",
                  data: [12, 18, 15, 28, 24, 35, 42].map((value, time) => ({
                    time,
                    value,
                  })),
                },
              ]}
            />
          </div>
          <p className="mt-4 text-xs text-muted">
            Sample values: 12, 18, 15, 28, 24, 35, 42.
          </p>
        </Card>
      )}
    </div>
  );
}

function UtilityDemo({ kind }: { kind: string }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const visible = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(query.toLowerCase()) &&
      (role === "all" || row.role === role),
  );
  return (
    <div className="w-full max-w-xl space-y-5">
      {kind === "copy-button" && (
        <Card>
          <code className="mb-4 block break-all text-xs">pnpm run dev</code>
          <CopyButton value="pnpm run dev" />
        </Card>
      )}
      {kind === "search-input" && (
        <>
          <SearchInput
            label="Search team members"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
          />
          <SearchInput
            label="Disabled search"
            disabled
            placeholder="Search unavailable"
          />
          <p role="status" className="text-xs text-muted">
            {visible.length} matching sample members.
          </p>
        </>
      )}
      {kind === "filter-bar" && (
        <>
          <FilterBar
            query={query}
            onQueryChange={setQuery}
            label="Filter by role"
            value={role}
            onValueChange={setRole}
            options={[
              { value: "all", label: "All roles" },
              ...["Designer", "Engineer", "Researcher"].map((value) => ({
                value,
                label: value,
              })),
            ]}
          />
          <Table
            caption="Filtered team"
            rows={visible}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </>
      )}
    </div>
  );
}

type ExtendedId = (typeof EXTENDED_COMPONENTS)[number]["id"];

export const EXTENDED_DEMOS: Record<ExtendedId, ComponentType> = {
  select: () => <FormDemo kind="select" />,
  textarea: () => <FormDemo kind="textarea" />,
  checkbox: () => <FormDemo kind="checkbox" />,
  "radio-group": () => <FormDemo kind="radio-group" />,
  combobox: () => <FormDemo kind="combobox" />,
  "multi-select": () => <FormDemo kind="multi-select" />,
  slider: () => <FormDemo kind="slider" />,
  "number-input": () => <FormDemo kind="number-input" />,
  "date-picker": () => <FormDemo kind="date-picker" />,
  "date-range-picker": () => <FormDemo kind="date-range-picker" />,
  "time-picker": () => <FormDemo kind="time-picker" />,
  "otp-input": () => <FormDemo kind="otp-input" />,
  dropzone: UploadDemo,
  "file-upload-list": FileListDemo,
  "upload-progress": UploadProgressDemo,
  "image-preview": () => <UploadDemo imagesOnly />,
  "icon-button": () => <ActionDemo kind="icon-button" />,
  "button-group": () => <ActionDemo kind="button-group" />,
  "dropdown-menu": () => <ActionDemo kind="dropdown-menu" />,
  "split-button": () => <ActionDemo kind="split-button" />,
  breadcrumbs: () => <NavigationDemo kind="breadcrumbs" />,
  pagination: () => <NavigationDemo kind="pagination" />,
  "navigation-menu": () => <NavigationDemo kind="navigation-menu" />,
  stepper: () => <NavigationDemo kind="stepper" />,
  "command-palette": () => <NavigationDemo kind="command-palette" />,
  "alert-dialog": () => <OverlayDemo kind="alert-dialog" />,
  drawer: () => <OverlayDemo kind="drawer" />,
  popover: () => <OverlayDemo kind="popover" />,
  tooltip: () => <OverlayDemo kind="tooltip" />,
  toast: () => (
    <ToastProvider>
      <ToastActions />
    </ToastProvider>
  ),
  "progress-bar": () => <FeedbackDemo kind="progress-bar" />,
  spinner: () => <FeedbackDemo kind="spinner" />,
  skeleton: () => <FeedbackDemo kind="skeleton" />,
  "empty-state": () => <FeedbackDemo kind="empty-state" />,
  avatar: () => <ContentDemo kind="avatar" />,
  "avatar-group": () => <ContentDemo kind="avatar-group" />,
  card: () => <ContentDemo kind="card" />,
  accordion: () => <ContentDemo kind="accordion" />,
  separator: () => <ContentDemo kind="separator" />,
  "scroll-area": () => <ContentDemo kind="scroll-area" />,
  collapsible: () => <ContentDemo kind="collapsible" />,
  list: () => <ContentDemo kind="list" />,
  table: () => <DataDemo kind="table" />,
  "data-table": () => <DataDemo kind="data-table" />,
  "description-list": () => <DataDemo kind="description-list" />,
  timeline: () => <DataDemo kind="timeline" />,
  calendar: () => <DataDemo kind="calendar" />,
  charts: () => <DataDemo kind="charts" />,
  "copy-button": () => <UtilityDemo kind="copy-button" />,
  "search-input": () => <UtilityDemo kind="search-input" />,
  "filter-bar": () => <UtilityDemo kind="filter-bar" />,
};
