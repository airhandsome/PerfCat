# CMAKE generated file: DO NOT EDIT!
# Generated by "MinGW Makefiles" Generator, CMake Version 3.17

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Disable VCS-based implicit rules.
% : %,v


# Disable VCS-based implicit rules.
% : RCS/%


# Disable VCS-based implicit rules.
% : RCS/%,v


# Disable VCS-based implicit rules.
% : SCCS/s.%


# Disable VCS-based implicit rules.
% : s.%


.SUFFIXES: .hpux_make_needs_suffix_list


# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

SHELL = cmd.exe

# The CMake executable.
CMAKE_COMMAND = "C:\Program Files\JetBrains\CLion 2020.2.4\bin\cmake\win\bin\cmake.exe"

# The command to remove a file.
RM = "C:\Program Files\JetBrains\CLion 2020.2.4\bin\cmake\win\bin\cmake.exe" -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = D:\upa_github\hardware-perfcounter

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = D:\upa_github\hardware-perfcounter\cmake-build-debug

# Include any dependencies generated for this target.
include lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/depend.make

# Include the progress variables for this target.
include lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/progress.make

# Include the compile flags for this target's objects.
include lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/flags.make

lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.obj: lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/flags.make
lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.obj: lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/includes_C.rsp
lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.obj: ../lib/gpu/mali/valhall.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=D:\upa_github\hardware-perfcounter\cmake-build-debug\CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building C object lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.obj"
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali && "D:\Program Files\mingw-w64\x86_64-8.1.0-posix-seh-rt_v6-rev0\mingw64\bin\gcc.exe" $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles\hpc-gpu-mali-valhall.dir\valhall.c.obj   -c D:\upa_github\hardware-perfcounter\lib\gpu\mali\valhall.c

lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.i"
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali && "D:\Program Files\mingw-w64\x86_64-8.1.0-posix-seh-rt_v6-rev0\mingw64\bin\gcc.exe" $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E D:\upa_github\hardware-perfcounter\lib\gpu\mali\valhall.c > CMakeFiles\hpc-gpu-mali-valhall.dir\valhall.c.i

lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.s"
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali && "D:\Program Files\mingw-w64\x86_64-8.1.0-posix-seh-rt_v6-rev0\mingw64\bin\gcc.exe" $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S D:\upa_github\hardware-perfcounter\lib\gpu\mali\valhall.c -o CMakeFiles\hpc-gpu-mali-valhall.dir\valhall.c.s

# Object files for target hpc-gpu-mali-valhall
hpc__gpu__mali__valhall_OBJECTS = \
"CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.obj"

# External object files for target hpc-gpu-mali-valhall
hpc__gpu__mali__valhall_EXTERNAL_OBJECTS =

lib/gpu/mali/libhpc-gpu-mali-valhall.a: lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/valhall.c.obj
lib/gpu/mali/libhpc-gpu-mali-valhall.a: lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/build.make
lib/gpu/mali/libhpc-gpu-mali-valhall.a: lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=D:\upa_github\hardware-perfcounter\cmake-build-debug\CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking C static library libhpc-gpu-mali-valhall.a"
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali && $(CMAKE_COMMAND) -P CMakeFiles\hpc-gpu-mali-valhall.dir\cmake_clean_target.cmake
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles\hpc-gpu-mali-valhall.dir\link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/build: lib/gpu/mali/libhpc-gpu-mali-valhall.a

.PHONY : lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/build

lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/clean:
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali && $(CMAKE_COMMAND) -P CMakeFiles\hpc-gpu-mali-valhall.dir\cmake_clean.cmake
.PHONY : lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/clean

lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/depend:
	$(CMAKE_COMMAND) -E cmake_depends "MinGW Makefiles" D:\upa_github\hardware-perfcounter D:\upa_github\hardware-perfcounter\lib\gpu\mali D:\upa_github\hardware-perfcounter\cmake-build-debug D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali D:\upa_github\hardware-perfcounter\cmake-build-debug\lib\gpu\mali\CMakeFiles\hpc-gpu-mali-valhall.dir\DependInfo.cmake --color=$(COLOR)
.PHONY : lib/gpu/mali/CMakeFiles/hpc-gpu-mali-valhall.dir/depend

