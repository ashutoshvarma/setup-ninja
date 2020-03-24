![Main Workflow](https://github.com/ashutoshvarma/setup-ninja/workflows/Main%20Workflow/badge.svg)

# setup-ninja

Github Action for configuring ninja build tool into PATH

Official ninja-build binaries are downloaded from [ninja-build](https://github.com/ninja-build/ninja/releases) github releases and added to the PATH of runner.

## Quickstart

```yaml
   - name: Build C/C++
        uses: ashutoshvarma/setup-ninja@master
        with:
          # ninja version to download. Default: 1.10.0
          version: 1.10.0

        uses: ashutoshvarma/action-cmake-build@master
        with:
          build-dir: ${{ runner.workspace }}/build
          cc: gcc
          cxx: g++
          configure-options: -G Ninja
          build-type: Release
        
```

### Action Reference: All Input/Output & Defaults
[action.yml](https://github.com/ashutoshvarma/setup-ninja/blob/master/action.yml) 

## License
All the content in this repository is licensed under the MIT License.

Copyright (c) 2019-2020 Ashutosh Varma