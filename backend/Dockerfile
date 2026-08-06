# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project file manifests
COPY ["src/BelanjaYuk.Domain/BelanjaYuk.Domain.csproj", "src/BelanjaYuk.Domain/"]
COPY ["src/BelanjaYuk.Application/BelanjaYuk.Application.csproj", "src/BelanjaYuk.Application/"]
COPY ["src/BelanjaYuk.Infrastructure/BelanjaYuk.Infrastructure.csproj", "src/BelanjaYuk.Infrastructure/"]
COPY ["src/BelanjaYuk.Api/BelanjaYuk.Api.csproj", "src/BelanjaYuk.Api/"]

# Restore packages
RUN dotnet restore "src/BelanjaYuk.Api/BelanjaYuk.Api.csproj"

# Copy source code and build
COPY . .
WORKDIR "/src/src/BelanjaYuk.Api"
RUN dotnet build "BelanjaYuk.Api.csproj" -c Release -o /app/build
RUN dotnet publish "BelanjaYuk.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "BelanjaYuk.Api.dll"]
