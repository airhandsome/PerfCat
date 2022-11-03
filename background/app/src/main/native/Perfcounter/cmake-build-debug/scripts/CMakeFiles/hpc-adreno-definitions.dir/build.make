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

# Utility rule file for hpc-adreno-definitions.

# Include the progress variables for this target.
include scripts/CMakeFiles/hpc-adreno-definitions.dir/progress.make

scripts/CMakeFiles/hpc-adreno-definitions: ../include/hpc/gpu/adreno/a5xx.h
scripts/CMakeFiles/hpc-adreno-definitions: ../include/hpc/gpu/adreno/a6xx.h
scripts/CMakeFiles/hpc-adreno-definitions: ../include/hpc/gpu/adreno/common.h
scripts/CMakeFiles/hpc-adreno-definitions: ../lib/gpu/adreno/a5xx.c
scripts/CMakeFiles/hpc-adreno-definitions: ../lib/gpu/adreno/a6xx.c
scripts/CMakeFiles/hpc-adreno-definitions: ../lib/gpu/adreno/common.c


../include/hpc/gpu/adreno/a5xx.h: ../scripts/generate_adreno_definitions.py
../include/hpc/gpu/adreno/a5xx.h: ../third_party/envytools/registers/adreno/a5xx.xml
../include/hpc/gpu/adreno/a5xx.h: ../third_party/envytools/registers/adreno/a6xx.xml
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=D:\upa_github\hardware-perfcounter\cmake-build-debug\CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Generating Adreno definitions"
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\scripts && C:\Users\y\AppData\Local\Programs\Python\Python37\python.exe D:/upa_github/hardware-perfcounter/scripts/generate_adreno_definitions.py --a5xx_xml D:/upa_github/hardware-perfcounter/third_party/envytools/registers/adreno/a5xx.xml --a6xx_xml D:/upa_github/hardware-perfcounter/third_party/envytools/registers/adreno/a6xx.xml -o D:/upa_github/hardware-perfcounter

../include/hpc/gpu/adreno/a6xx.h: ../include/hpc/gpu/adreno/a5xx.h
	@$(CMAKE_COMMAND) -E touch_nocreate ..\include\hpc\gpu\adreno\a6xx.h

../include/hpc/gpu/adreno/common.h: ../include/hpc/gpu/adreno/a5xx.h
	@$(CMAKE_COMMAND) -E touch_nocreate ..\include\hpc\gpu\adreno\common.h

../lib/gpu/adreno/a5xx.c: ../include/hpc/gpu/adreno/a5xx.h
	@$(CMAKE_COMMAND) -E touch_nocreate ..\lib\gpu\adreno\a5xx.c

../lib/gpu/adreno/a6xx.c: ../include/hpc/gpu/adreno/a5xx.h
	@$(CMAKE_COMMAND) -E touch_nocreate ..\lib\gpu\adreno\a6xx.c

../lib/gpu/adreno/common.c: ../include/hpc/gpu/adreno/a5xx.h
	@$(CMAKE_COMMAND) -E touch_nocreate ..\lib\gpu\adreno\common.c

hpc-adreno-definitions: scripts/CMakeFiles/hpc-adreno-definitions
hpc-adreno-definitions: ../include/hpc/gpu/adreno/a5xx.h
hpc-adreno-definitions: ../include/hpc/gpu/adreno/a6xx.h
hpc-adreno-definitions: ../include/hpc/gpu/adreno/common.h
hpc-adreno-definitions: ../lib/gpu/adreno/a5xx.c
hpc-adreno-definitions: ../lib/gpu/adreno/a6xx.c
hpc-adreno-definitions: ../lib/gpu/adreno/common.c
hpc-adreno-definitions: scripts/CMakeFiles/hpc-adreno-definitions.dir/build.make

.PHONY : hpc-adreno-definitions

# Rule to build all files generated by this target.
scripts/CMakeFiles/hpc-adreno-definitions.dir/build: hpc-adreno-definitions

.PHONY : scripts/CMakeFiles/hpc-adreno-definitions.dir/build

scripts/CMakeFiles/hpc-adreno-definitions.dir/clean:
	cd /d D:\upa_github\hardware-perfcounter\cmake-build-debug\scripts && $(CMAKE_COMMAND) -P CMakeFiles\hpc-adreno-definitions.dir\cmake_clean.cmake
.PHONY : scripts/CMakeFiles/hpc-adreno-definitions.dir/clean

scripts/CMakeFiles/hpc-adreno-definitions.dir/depend:
	$(CMAKE_COMMAND) -E cmake_depends "MinGW Makefiles" D:\upa_github\hardware-perfcounter D:\upa_github\hardware-perfcounter\scripts D:\upa_github\hardware-perfcounter\cmake-build-debug D:\upa_github\hardware-perfcounter\cmake-build-debug\scripts D:\upa_github\hardware-perfcounter\cmake-build-debug\scripts\CMakeFiles\hpc-adreno-definitions.dir\DependInfo.cmake --color=$(COLOR)
.PHONY : scripts/CMakeFiles/hpc-adreno-definitions.dir/depend

