//
// Created by y on 2022/10/14.
//
#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

extern "C" {
#include "lib/gpu/adreno/common.h"
#include "lib/gpu/adreno/a6xx.h"
}

#include "lib/gpu/adreno/a5xx.h"
#include "lib/gpu/base_utilities.h"



#ifndef HARDWAREPERFCOUNTER_ADRENOPIPE_H
#define HARDWAREPERFCOUNTER_ADRENOPIPE_H


class AdrenoPipe
{
  public:
  static AdrenoPipe* Instance();
  static AdrenoPipe* Instance(hpc_gpu_adreno_a6xx_counter_t* gpu_counter, int length);
  static AdrenoPipe* Instance(hpc_gpu_adreno_a5xx_counter_t* gpu_counter, int length);

  hpc_gpu_adreno_context_t* context;
  uint64_t values[1000];
  int num_counters;
  int type;   //0 a5xx , 1 a6xx
  hpc_gpu_host_allocation_callbacks_t allocator;

  int run();
  int sample();
  bool stop();

  virtual ~AdrenoPipe() = default;

  private:
  static AdrenoPipe* _instance;
  AdrenoPipe();
  AdrenoPipe(hpc_gpu_adreno_a6xx_counter_t* gpu_counters, int length);
  AdrenoPipe(hpc_gpu_adreno_a5xx_counter_t* gpu_counters, int length);
};


#endif  // HARDWAREPERFCOUNTER_ADRENOPIPE_H
