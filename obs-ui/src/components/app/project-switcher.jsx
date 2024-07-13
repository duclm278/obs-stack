import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import * as React from "react";
import { Link } from "react-router-dom";
import projectService from "@/api/project";
import { toast } from "sonner";

export default function ProjectSwitcher({ className }) {
  const [open, setOpen] = React.useState(false);
  const [projects, setProjects] = React.useState([
    {
      label: "Default",
      value: "Default",
    },
  ]);
  const [selectedProject, setSelectedProject] = React.useState({
    label: "Default",
    value: "Default",
  });

  const groups = [{ label: "Project", projects }];

  const getProjects = async () => {
    try {
      const data = await projectService.getAll();
      const projects = data.content.map((p) => ({
        label: p.name,
        value: p.id,
      }));
      setProjects(projects);
      const selected =
        projects.length > 0
          ? projects[0]
          : { label: "Default", value: "Default" };
      setSelectedProject(selected);
      localStorage.setItem("project", selected.value);
    } catch (error) {
      const msg = error.response?.data?.message ?? error.message;
      toast.error("Projects", {
        description: msg,
        action: { label: "Hide", onClick: () => {} },
      });
    }
  };

  React.useEffect(() => {
    getProjects();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a project"
          className={cn("w-[200px] justify-between", className)}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`https://avatar.vercel.sh/${selectedProject.value}.png`}
              alt={selectedProject.label}
              className="grayscale"
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {selectedProject.label}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search projects.." />
            <CommandEmpty>No projects found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.projects.map((project) => (
                  <CommandItem
                    key={project.value}
                    onSelect={() => {
                      setSelectedProject(project);
                      setOpen(false);
                      localStorage.setItem("project", project.value);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${project.value}.png`}
                        alt={project.label}
                        className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {project.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedProject.value === project.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <Link to="/projects">
                <CommandItem onSelect={() => setOpen(false)}>
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  Manage Projects
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
