#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["WFNG.UI/WFNG.UI.csproj", "WFNG.UI/"]
RUN dotnet restore "WFNG.UI/WFNG.UI.csproj"
COPY . .
WORKDIR "/src/WFNG.UI"
RUN dotnet build "WFNG.UI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WFNG.UI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WFNG.UI.dll"]